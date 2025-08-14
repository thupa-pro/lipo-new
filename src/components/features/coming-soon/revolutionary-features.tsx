'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Eye, 
  Shield, 
  Coins, 
  Cube, 
  Brain, 
  Globe, 
  ChainIcon,
  Cpu,
  Heart,
  Calendar,
  Users,
  Star,
  Clock,
  Sparkles,
  Rocket,
  Lock,
  Gamepad2,
  Bot,
  TrendingUp
} from 'lucide-react';

interface RevolutionaryFeature {
  id: string;
  title: string;
  description: string;
  impact: 'revolutionary' | 'transformative' | 'game-changing';
  category: 'ai' | 'blockchain' | 'xr' | 'quantum' | 'defi';
  progress: number;
  eta: string;
  icon: React.ReactNode;
  benefits: string[];
  techStack: string[];
  status: 'research' | 'development' | 'testing' | 'launching';
}

const REVOLUTIONARY_FEATURES: RevolutionaryFeature[] = [
  {
    id: 'quantum-ai-matching',
    title: 'Quantum-Enhanced AI Matching Engine',
    description: 'Ultra-low latency provider-customer matching using neuromorphic computing and quantum algorithms for unprecedented accuracy and speed.',
    impact: 'revolutionary',
    category: 'quantum',
    progress: 15,
    eta: 'Q2 2025',
    icon: <Zap className="h-6 w-6" />,
    benefits: [
      '1000x faster matching than traditional algorithms',
      '99.97% accuracy in provider-customer compatibility',
      'Real-time adaptation to market dynamics',
      'Zero-latency decision making'
    ],
    techStack: ['Quantum Computing', 'Neuromorphic Chips', 'Edge AI', 'Real-time Processing'],
    status: 'research'
  },
  {
    id: 'ar-vr-preview',
    title: 'Immersive AR/VR Service Preview System',
    description: 'Experience services in virtual reality before booking. See exactly what you\'re getting with photorealistic simulations and interactive previews.',
    impact: 'transformative',
    category: 'xr',
    progress: 35,
    eta: 'Q3 2025',
    icon: <Eye className="h-6 w-6" />,
    benefits: [
      'Try before you buy with virtual experiences',
      '85% reduction in service dissatisfaction',
      'Immersive provider showcases',
      'Cross-platform VR/AR compatibility'
    ],
    techStack: ['WebXR', 'Unity Engine', 'Spatial Computing', 'AI Simulation'],
    status: 'development'
  },
  {
    id: 'self-healing-marketplace',
    title: 'Self-Healing Autonomous Marketplace',
    description: 'Predictive maintenance and zero-downtime operations powered by AI that automatically detects, diagnoses, and fixes issues before they impact users.',
    impact: 'game-changing',
    category: 'ai',
    progress: 60,
    eta: 'Q1 2025',
    icon: <Shield className="h-6 w-6" />,
    benefits: [
      '99.99% uptime guarantee',
      'Autonomous problem resolution',
      'Predictive maintenance alerts',
      'Self-optimizing performance'
    ],
    techStack: ['Machine Learning', 'Anomaly Detection', 'Auto-scaling', 'Monitoring AI'],
    status: 'testing'
  },
  {
    id: 'web3-defi-integration',
    title: 'Web3 DeFi Integration & NFT Rewards',
    description: 'Decentralized finance features with yield farming, NFT rewards for loyalty, and blockchain-based governance for community-driven decisions.',
    impact: 'revolutionary',
    category: 'defi',
    progress: 25,
    eta: 'Q4 2025',
    icon: <Coins className="h-6 w-6" />,
    benefits: [
      'Earn crypto rewards for participation',
      'Stake tokens for premium benefits',
      'NFT achievement system',
      'Decentralized governance voting'
    ],
    techStack: ['Ethereum', 'Smart Contracts', 'IPFS', 'DeFi Protocols'],
    status: 'development'
  },
  {
    id: 'holographic-demos',
    title: 'Real-Time Holographic Service Demonstrations',
    description: 'Cutting-edge holographic displays that showcase services in 3D space, bringing science fiction to reality for immersive experiences.',
    impact: 'revolutionary',
    category: 'xr',
    progress: 10,
    eta: 'Q1 2026',
    icon: <Cube className="h-6 w-6" />,
    benefits: [
      'Holographic service demonstrations',
      '360° interactive experiences',
      'Spatial audio integration',
      'Remote holographic consultations'
    ],
    techStack: ['Holographic Displays', 'Spatial Computing', '5G Edge', 'Light Field Tech'],
    status: 'research'
  },
  {
    id: 'metaverse-marketplace',
    title: 'Metaverse Service Marketplace',
    description: 'Virtual showrooms and immersive service experiences in the metaverse where providers can create stunning 3D environments for their services.',
    impact: 'transformative',
    category: 'xr',
    progress: 40,
    eta: 'Q3 2025',
    icon: <Globe className="h-6 w-6" />,
    benefits: [
      'Virtual service showrooms',
      'Metaverse provider stores',
      'Avatar-based consultations',
      'Virtual reality networking events'
    ],
    techStack: ['Metaverse Platforms', 'Blockchain', '3D Rendering', 'VR SDKs'],
    status: 'development'
  },
  {
    id: 'blockchain-reputation',
    title: 'Blockchain-Based Reputation & Trust System',
    description: 'Immutable reputation scores and smart contract-based dispute resolution that creates unprecedented trust and transparency in the marketplace.',
    impact: 'game-changing',
    category: 'blockchain',
    progress: 50,
    eta: 'Q2 2025',
    icon: <ChainIcon className="h-6 w-6" />,
    benefits: [
      'Tamper-proof reputation scores',
      'Smart contract dispute resolution',
      'Cross-platform trust verification',
      'Automated escrow services'
    ],
    techStack: ['Blockchain', 'Smart Contracts', 'Cryptography', 'Consensus Protocols'],
    status: 'testing'
  },
  {
    id: 'neuromorphic-edge',
    title: 'Neuromorphic Edge Computing',
    description: 'Brain-inspired computing at the edge for instant real-time decisions and ultra-responsive user experiences that feel telepathic.',
    impact: 'revolutionary',
    category: 'ai',
    progress: 20,
    eta: 'Q4 2025',
    icon: <Cpu className="h-6 w-6" />,
    benefits: [
      'Sub-millisecond response times',
      'Energy-efficient processing',
      'Adaptive learning algorithms',
      'Biologically-inspired AI'
    ],
    techStack: ['Neuromorphic Chips', 'Spiking Neural Networks', 'Edge AI', 'Low-power Computing'],
    status: 'research'
  },
  {
    id: 'hyper-personalized-ai',
    title: 'Hyper-Personalized AI',
    description: 'AI that learns and adapts to each user\'s unique preferences, behavior patterns, and needs to create truly personalized experiences.',
    impact: 'transformative',
    category: 'ai',
    progress: 70,
    eta: 'Q1 2025',
    icon: <Heart className="h-6 w-6" />,
    benefits: [
      'Personalized service recommendations',
      'Adaptive user interface',
      'Predictive need fulfillment',
      'Emotional intelligence integration'
    ],
    techStack: ['Deep Learning', 'Behavioral Analytics', 'Recommendation Systems', 'NLP'],
    status: 'testing'
  }
];

interface RevolutionaryFeaturesProps {
  className?: string;
}

export function RevolutionaryFeatures({ className = '' }: RevolutionaryFeaturesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<RevolutionaryFeature | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Animate progress bars on load
    const timer = setTimeout(() => {
      const progressMap: { [key: string]: number } = {};
      REVOLUTIONARY_FEATURES.forEach(feature => {
        progressMap[feature.id] = feature.progress;
      });
      setAnimatedProgress(progressMap);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Features', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'ai', name: 'AI & ML', icon: <Brain className="h-4 w-4" /> },
    { id: 'blockchain', name: 'Blockchain', icon: <ChainIcon className="h-4 w-4" /> },
    { id: 'xr', name: 'AR/VR/XR', icon: <Eye className="h-4 w-4" /> },
    { id: 'quantum', name: 'Quantum', icon: <Zap className="h-4 w-4" /> },
    { id: 'defi', name: 'DeFi', icon: <Coins className="h-4 w-4" /> },
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? REVOLUTIONARY_FEATURES 
    : REVOLUTIONARY_FEATURES.filter(f => f.category === selectedCategory);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'revolutionary': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'transformative': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'game-changing': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'research': return 'text-yellow-600 bg-yellow-100';
      case 'development': return 'text-blue-600 bg-blue-100';
      case 'testing': return 'text-green-600 bg-green-100';
      case 'launching': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full">
          <Rocket className="h-5 w-5 text-purple-500" />
          <span className="font-medium text-purple-700">Revolutionary Features Coming Soon</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          The Future of Service Marketplaces
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're building revolutionary features that will transform how you discover, experience, and interact with services. 
          Get ready for the next generation of marketplace innovation.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card 
            key={feature.id} 
            className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group"
            onClick={() => setSelectedFeature(feature)}
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${getImpactColor(feature.impact)}`} />
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${getImpactColor(feature.impact)} text-white`}>
                  {feature.icon}
                </div>
                <Badge className={getStatusColor(feature.status)}>
                  {feature.status}
                </Badge>
              </div>
              <CardTitle className="group-hover:text-purple-600 transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Development Progress</span>
                  <span className="text-sm text-muted-foreground">{feature.progress}%</span>
                </div>
                <Progress 
                  value={animatedProgress[feature.id] || 0} 
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">ETA: {feature.eta}</span>
                </div>
                <Badge variant="outline" className={getImpactColor(feature.impact).replace('bg-gradient-to-r', 'border-gradient')}>
                  {feature.impact}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getImpactColor(selectedFeature.impact)} text-white`}>
                      {selectedFeature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedFeature.title}</CardTitle>
                      <Badge className={getStatusColor(selectedFeature.status)}>
                        {selectedFeature.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedFeature(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{selectedFeature.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedFeature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeature.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Development Progress</span>
                  <span className="text-muted-foreground">{selectedFeature.progress}%</span>
                </div>
                <Progress value={selectedFeature.progress} className="h-3" />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Expected Launch: {selectedFeature.eta}</span>
                </div>
                <Button className={getImpactColor(selectedFeature.impact)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call to Action */}
      <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold">Be Part of the Revolution</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These features will revolutionize how service marketplaces work. 
            Join our early access program to be among the first to experience the future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Users className="h-4 w-4 mr-2" />
              Join Early Access
            </Button>
            <Button size="lg" variant="outline">
              <Bot className="h-4 w-4 mr-2" />
              Get Notified
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
