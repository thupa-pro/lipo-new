-- Add vector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add PostGIS extension for location features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add listing embeddings table for semantic search
CREATE TABLE listing_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768), -- Google's text-embedding-004 dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for vector search
CREATE INDEX listing_embeddings_embedding_idx ON listing_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX listing_embeddings_listing_id_idx ON listing_embeddings(listing_id);

-- Add provider availability table
CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'blocked')),
  recurring_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX provider_availability_provider_date_idx ON provider_availability(provider_id, date);
CREATE INDEX provider_availability_date_idx ON provider_availability(date);

-- Add pricing calculations table for dynamic pricing
CREATE TABLE pricing_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id),
  base_price DECIMAL(10,2) NOT NULL,
  dynamic_price DECIMAL(10,2) NOT NULL,
  surge_multiplier DECIMAL(4,2) NOT NULL,
  factors JSONB NOT NULL,
  request_data JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX pricing_calculations_service_id_idx ON pricing_calculations(service_id);
CREATE INDEX pricing_calculations_calculated_at_idx ON pricing_calculations(calculated_at);

-- Add data deletion requests table for GDPR compliance
CREATE TABLE data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  reason TEXT,
  backup_email VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_deletion_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX data_deletion_requests_user_id_idx ON data_deletion_requests(user_id);
CREATE INDEX data_deletion_requests_status_idx ON data_deletion_requests(status);

-- Add fields to services table for advanced features
ALTER TABLE services ADD COLUMN IF NOT EXISTS embedding_indexed BOOLEAN DEFAULT FALSE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS dynamic_pricing_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS surge_multiplier_max DECIMAL(3,2) DEFAULT 2.0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS minimum_price DECIMAL(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS price_type VARCHAR(20) DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'quote'));
ALTER TABLE services ADD COLUMN IF NOT EXISTS availability JSONB;
ALTER TABLE services ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add fields to users table for GDPR compliance
ALTER TABLE users ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add fields to messages table for GDPR compliance  
ALTER TABLE messages ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ;

-- Add fields to analytics_events table for GDPR compliance
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ;

-- Function to search listings by embedding vector
CREATE OR REPLACE FUNCTION search_listings_by_embedding(
  query_embedding vector(768),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  listing_id UUID,
  content TEXT,
  metadata JSONB,
  similarity float
) 
LANGUAGE sql STABLE
AS $$
  SELECT 
    le.listing_id,
    le.content,
    le.metadata,
    1 - (le.embedding <=> query_embedding) as similarity
  FROM listing_embeddings le
  WHERE 1 - (le.embedding <=> query_embedding) > similarity_threshold
    AND (filter_metadata = '{}'::jsonb OR le.metadata @> filter_metadata)
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Function to find nearby providers with services
CREATE OR REPLACE FUNCTION nearby_providers_with_services(
  lat float,
  lng float,
  radius_km float DEFAULT 10,
  category_id UUID DEFAULT NULL,
  budget_min float DEFAULT NULL,
  budget_max float DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  business_name VARCHAR,
  rating_average DECIMAL,
  rating_count INTEGER,
  location JSONB,
  services JSONB,
  distance float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    p.id,
    p.business_name,
    p.rating_average,
    p.rating_count,
    p.location,
    jsonb_agg(jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'price', s.price,
      'price_type', s.price_type
    )) as services,
    ST_Distance(
      ST_Point((p.location->>'lng')::float, (p.location->>'lat')::float)::geography,
      ST_Point(lng, lat)::geography
    ) / 1000 as distance
  FROM providers p
  JOIN services s ON s.provider_id = p.id
  WHERE p.is_active = true 
    AND s.is_active = true
    AND ST_DWithin(
      ST_Point((p.location->>'lng')::float, (p.location->>'lat')::float)::geography,
      ST_Point(lng, lat)::geography,
      radius_km * 1000
    )
    AND (category_id IS NULL OR s.category_id = category_id)
    AND (budget_min IS NULL OR s.price >= budget_min)
    AND (budget_max IS NULL OR s.price <= budget_max)
  GROUP BY p.id, p.business_name, p.rating_average, p.rating_count, p.location
  ORDER BY distance;
$$;

-- Function to count nearby providers
CREATE OR REPLACE FUNCTION nearby_providers_count(
  lat float,
  lng float,
  radius_km float DEFAULT 10,
  category_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE sql STABLE
AS $$
  SELECT COUNT(DISTINCT p.id)::INTEGER
  FROM providers p
  JOIN services s ON s.provider_id = p.id
  WHERE p.is_active = true 
    AND s.is_active = true
    AND ST_DWithin(
      ST_Point((p.location->>'lng')::float, (p.location->>'lat')::float)::geography,
      ST_Point(lng, lat)::geography,
      radius_km * 1000
    )
    AND (category_id IS NULL OR s.category_id = category_id);
$$;

-- Function to find nearby services
CREATE OR REPLACE FUNCTION nearby_services(
  lat float,
  lng float,
  radius_km float DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  price DECIMAL,
  provider_id UUID,
  distance float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    s.id,
    s.name,
    s.description,
    s.price,
    s.provider_id,
    ST_Distance(
      ST_Point((p.location->>'lng')::float, (p.location->>'lat')::float)::geography,
      ST_Point(lng, lat)::geography
    ) / 1000 as distance
  FROM services s
  JOIN providers p ON p.id = s.provider_id
  WHERE s.is_active = true 
    AND p.is_active = true
    AND ST_DWithin(
      ST_Point((p.location->>'lng')::float, (p.location->>'lat')::float)::geography,
      ST_Point(lng, lat)::geography,
      radius_km * 1000
    )
  ORDER BY distance;
$$;

-- Add RLS policies for new tables
ALTER TABLE listing_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Listing embeddings policies (public read, admin write)
CREATE POLICY "listing_embeddings_public_read" ON listing_embeddings
  FOR SELECT USING (true);

CREATE POLICY "listing_embeddings_admin_write" ON listing_embeddings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Provider availability policies (providers manage their own)
CREATE POLICY "provider_availability_provider_manage" ON provider_availability
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM providers p 
      JOIN users u ON u.id = p.user_id
      WHERE p.id = provider_availability.provider_id 
      AND u.id = auth.uid()
    )
  );

CREATE POLICY "provider_availability_public_read" ON provider_availability
  FOR SELECT USING (status = 'available');

-- Pricing calculations policies (providers can view their own)
CREATE POLICY "pricing_calculations_provider_read" ON pricing_calculations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM services s
      JOIN providers p ON p.id = s.provider_id
      JOIN users u ON u.id = p.user_id
      WHERE s.id = pricing_calculations.service_id
      AND u.id = auth.uid()
    )
  );

-- Data deletion requests policies (users manage their own)
CREATE POLICY "data_deletion_requests_user_manage" ON data_deletion_requests
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX services_category_id_idx ON services(category_id);
CREATE INDEX services_is_active_idx ON services(is_active);
CREATE INDEX providers_is_active_idx ON providers(is_active);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listing_embeddings_updated_at 
  BEFORE UPDATE ON listing_embeddings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_availability_updated_at 
  BEFORE UPDATE ON provider_availability 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
