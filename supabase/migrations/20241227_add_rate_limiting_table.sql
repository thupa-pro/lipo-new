-- Add rate limiting table for enhanced security middleware
CREATE TABLE IF NOT EXISTS rate_limit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_key TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_client_time 
ON rate_limit_requests (client_key, created_at);

-- Index for cleanup operations
CREATE INDEX IF NOT EXISTS idx_rate_limit_cleanup 
ON rate_limit_requests (created_at);

-- Add voice interface usage tracking
CREATE TABLE IF NOT EXISTS voice_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT,
    command TEXT NOT NULL,
    intent JSONB,
    success BOOLEAN DEFAULT FALSE,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for voice analytics
CREATE INDEX IF NOT EXISTS idx_voice_interactions_user 
ON voice_interactions (user_id, created_at);

-- Add performance monitoring table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    response_time_ms INTEGER NOT NULL,
    status_code INTEGER NOT NULL,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance analytics
CREATE INDEX IF NOT EXISTS idx_performance_endpoint_time 
ON performance_metrics (endpoint, created_at);

-- Function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_rate_limit_requests()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limit_requests 
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old performance metrics (keep 30 days)
CREATE OR REPLACE FUNCTION cleanup_performance_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM performance_metrics 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Add subscription tiers table for enhanced monetization
CREATE TABLE IF NOT EXISTS subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    features JSONB NOT NULL DEFAULT '[]',
    limits JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, price_monthly, price_yearly, features, limits) VALUES
('Free', 0.00, 0.00, 
 '["Basic search", "2 bookings per month", "Standard support"]',
 '{"monthly_bookings": 2, "ai_requests": 5, "api_calls": 100}'
),
('Pro', 19.00, 190.00,
 '["Unlimited bookings", "Priority matching", "Advanced filters", "Email support"]',
 '{"monthly_bookings": -1, "ai_requests": 50, "api_calls": 1000}'
),
('Premium', 49.00, 490.00,
 '["AI concierge", "Voice interface", "AR previews", "Priority support", "Analytics dashboard"]',
 '{"monthly_bookings": -1, "ai_requests": 500, "api_calls": 10000}'
),
('Enterprise', 199.00, 1990.00,
 '["API access", "White-label options", "Custom integrations", "Dedicated support", "Advanced analytics"]',
 '{"monthly_bookings": -1, "ai_requests": -1, "api_calls": -1}'
);

-- Add user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tier_id UUID REFERENCES subscription_tiers(id) NOT NULL,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'suspended')),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month',
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for subscription lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_user 
ON user_subscriptions (user_id) WHERE status = 'active';

-- Add usage tracking for subscription limits
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    resource_type TEXT NOT NULL, -- 'bookings', 'ai_requests', 'api_calls'
    count INTEGER DEFAULT 1,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for usage queries
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period 
ON usage_tracking (user_id, resource_type, period_start, period_end);

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
    p_user_id UUID,
    p_resource_type TEXT,
    p_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    current_usage INTEGER;
    period_start TIMESTAMPTZ;
    period_end TIMESTAMPTZ;
BEGIN
    -- Calculate current month period
    period_start := date_trunc('month', NOW());
    period_end := period_start + INTERVAL '1 month';
    
    -- Get current usage for this period
    SELECT COALESCE(SUM(count), 0) INTO current_usage
    FROM usage_tracking
    WHERE user_id = p_user_id
    AND resource_type = p_resource_type
    AND period_start <= NOW()
    AND period_end > NOW();
    
    -- Return true if under limit (or unlimited = -1)
    RETURN p_limit = -1 OR current_usage < p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to record usage
CREATE OR REPLACE FUNCTION record_usage(
    p_user_id UUID,
    p_resource_type TEXT,
    p_count INTEGER DEFAULT 1
) RETURNS void AS $$
DECLARE
    period_start TIMESTAMPTZ;
    period_end TIMESTAMPTZ;
BEGIN
    -- Calculate current month period
    period_start := date_trunc('month', NOW());
    period_end := period_start + INTERVAL '1 month';
    
    -- Insert or update usage record
    INSERT INTO usage_tracking (user_id, resource_type, count, period_start, period_end)
    VALUES (p_user_id, p_resource_type, p_count, period_start, period_end)
    ON CONFLICT (user_id, resource_type, period_start, period_end)
    DO UPDATE SET 
        count = usage_tracking.count + p_count,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger for user_subscriptions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
