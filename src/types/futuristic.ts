// Enhanced TypeScript definitions for futuristic Loconomy features

export interface AIPersonalizationData {
  userIntent: 'exploring' | 'booking' | 'comparing' | 'urgent' | 'research';
  personalizedContent: {
    heroText: string;
    ctaText: string;
    theme: 'default' | 'urgent' | 'premium' | 'minimal';
    recommendations: ServiceRecommendation[];
  };
  behaviorProfile: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: 'weekday' | 'weekend';
    deviceType: 'mobile' | 'tablet' | 'desktop';
    location?: GeolocationData;
  };
}

export interface ServiceRecommendation {
  id: string;
  name: string;
  category: string;
  confidence: number;
  reason: string;
  price: number;
  availability: string;
  features: string[];
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timezone: string;
}

export interface VoiceInterfaceData {
  isListening: boolean;
  transcript: string;
  confidence: number;
  intent?: {
    action: 'search' | 'book' | 'compare' | 'help';
    entities: Record<string, string>;
    confidence: number;
  };
  error?: string;
}

export interface RealTimeStats {
  userCount: number;
  providerCount: number;
  bookingCount: number;
  averageRating: number;
  responseTime: string;
  successRate: string;
  liveUsers: number;
  revenueToday: number;
  completedToday: number;
  trendsData: {
    userGrowth: number;
    revenueGrowth: number;
    satisfactionTrend: 'up' | 'down' | 'stable';
  };
}

export interface EnhancedCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  trend: string;
  aiFeatures: string[];
  avgPrice: string;
  nextAvailable: string;
  metadata: {
    popularityScore: number;
    growthRate: number;
    customerSatisfaction: number;
    avgCompletionTime: string;
    topProviders: number;
  };
  smartPricing: {
    demandLevel: 'low' | 'medium' | 'high' | 'peak';
    priceMultiplier: number;
    suggestedPrice: number;
    savings?: number;
  };
}

export interface QuantumSecurityFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  verificationLevel: 'basic' | 'advanced' | 'quantum';
  trustScore: number;
  features: string[];
}

export interface MicroInteraction {
  trigger: 'hover' | 'click' | 'scroll' | 'focus' | 'load';
  animation: {
    type: 'scale' | 'rotate' | 'translate' | 'fade' | 'morph';
    duration: number;
    easing: string;
    delay?: number;
  };
  feedback: {
    haptic?: boolean;
    sound?: string;
    visual?: 'glow' | 'pulse' | 'ripple' | 'particle';
  };
}

export interface GlassmorphismTheme {
  primary: string;
  secondary: string;
  accent: string;
  blur: number;
  opacity: number;
  borderOpacity: number;
  shadowIntensity: number;
}

export interface NeuralNetworkVisualization {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  animationSpeed: number;
  pulseInterval: number;
  colorScheme: 'default' | 'rainbow' | 'monochrome' | 'neon';
}

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  pulse: boolean;
  data?: any;
}

export interface NetworkConnection {
  from: string;
  to: string;
  strength: number;
  animated: boolean;
  color: string;
}

export interface QuantumAnimationConfig {
  particles: {
    count: number;
    speed: number;
    size: number;
    color: string;
    opacity: number;
  };
  waves: {
    amplitude: number;
    frequency: number;
    speed: number;
    count: number;
  };
  holographicText: {
    colors: string[];
    speed: number;
    intensity: number;
  };
}

export interface BiometricAuthData {
  fingerprint?: {
    available: boolean;
    enrolled: boolean;
    verified: boolean;
  };
  faceId?: {
    available: boolean;
    enrolled: boolean;
    verified: boolean;
  };
  voiceprint?: {
    available: boolean;
    enrolled: boolean;
    verified: boolean;
  };
  retina?: {
    available: boolean;
    enrolled: boolean;
    verified: boolean;
  };
}

export interface ARVisualization {
  enabled: boolean;
  deviceSupport: {
    webXR: boolean;
    arCore: boolean;
    arKit: boolean;
  };
  features: {
    objectPlacement: boolean;
    roomMapping: boolean;
    lightEstimation: boolean;
    faceTracking: boolean;
  };
  content: ARContent[];
}

export interface ARContent {
  id: string;
  type: '3d-model' | 'video' | 'image' | 'text' | 'interactive';
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  animations?: ARAnimation[];
}

export interface ARAnimation {
  type: 'rotate' | 'scale' | 'translate' | 'morph';
  duration: number;
  loop: boolean;
  autoStart: boolean;
  keyframes: any[];
}

export interface BlockchainIdentity {
  walletAddress: string;
  reputationScore: number;
  verificationLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'quantum';
  nftBadges: NFTBadge[];
  transactionHistory: BlockchainTransaction[];
  smartContracts: SmartContract[];
}

export interface NFTBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  attributes: Record<string, string | number>;
  earnedDate: Date;
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  type: 'service_payment' | 'reputation_update' | 'badge_earned' | 'contract_execution';
  amount?: number;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface SmartContract {
  address: string;
  type: 'service_escrow' | 'reputation_oracle' | 'automatic_payment' | 'dispute_resolution';
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  terms: Record<string, any>;
  milestones: ContractMilestone[];
}

export interface ContractMilestone {
  id: string;
  description: string;
  completionCriteria: string[];
  reward: number;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface QuantumPerformanceMetrics {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa: number;
  };
  webVitals: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  customMetrics: {
    aiResponseTime: number;
    voiceRecognitionLatency: number;
    arRenderTime: number;
    blockchainVerificationTime: number;
  };
}

export interface EdgeComputingConfig {
  regions: EdgeRegion[];
  cachingStrategy: 'aggressive' | 'balanced' | 'conservative';
  cdnProvider: 'cloudflare' | 'fastly' | 'aws' | 'vercel';
  edgeFeatures: {
    edgeComputing: boolean;
    edgeStorage: boolean;
    edgeAI: boolean;
    edgeAnalytics: boolean;
  };
}

export interface EdgeRegion {
  id: string;
  name: string;
  code: string;
  latency: number;
  capacity: number;
  features: string[];
  costMultiplier: number;
}

export interface MultiTenantConfig {
  tenantId: string;
  subdomain: string;
  customDomain?: string;
  branding: {
    logo: string;
    colors: Record<string, string>;
    fonts: Record<string, string>;
    customCSS?: string;
  };
  features: {
    aiPowered: boolean;
    blockchainIntegration: boolean;
    voiceInterface: boolean;
    arVisualization: boolean;
    quantumSecurity: boolean;
  };
  limits: {
    users: number;
    providers: number;
    transactions: number;
    storage: number;
    bandwidth: number;
  };
}

export interface IntelligentNotification {
  id: string;
  type: 'ai_insight' | 'quantum_alert' | 'blockchain_update' | 'ar_prompt' | 'voice_reminder';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  timing: {
    showAt: Date;
    hideAt?: Date;
    repeatInterval?: number;
    maxRepeats?: number;
  };
  personalization: {
    targetUserTypes: string[];
    timePreferences: string[];
    deviceTypes: string[];
    locationBased: boolean;
  };
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
    dismissals: number;
  };
}

// Global type augmentations for Web APIs
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
  
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<any>;
    };
    ml?: {
      createContext(): Promise<any>;
    };
  }
}

export {};
