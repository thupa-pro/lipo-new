import { Metadata } from 'next';
import { RevolutionaryFeatures } from '@/components/features/coming-soon/revolutionary-features';
import { DynamicUniverseEngine } from '@/components/features/ai/dynamic-universe-engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Brain, 
  Rocket, 
  Globe,
  Sparkles,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Future Technology | Loconomy - Revolutionary Features Coming Soon',
  description: 'Discover the cutting-edge features and revolutionary technology coming to Loconomy. From quantum AI to blockchain integration, experience the future of service marketplaces.',
  keywords: 'future technology, AI marketplace, blockchain, quantum computing, AR VR, metaverse, DeFi, revolutionary features',
};

export default function FutureTechPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-700">Future Technology Preview</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            The Future is Here
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Experience revolutionary technology that will transform service marketplaces forever. 
            We're building the impossible and making it reality.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">9</div>
              <div className="text-sm text-muted-foreground">Revolutionary Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">Technology Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2025</div>
              <div className="text-sm text-muted-foreground">Launch Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </div>

        {/* Live Demo Section */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-500" />
                  AI-Powered Dynamic Universe
                  <Badge className="bg-green-500 text-white">LIVE NOW</Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Experience our revolutionary AI that learns and evolves in real-time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">Live & Learning</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DynamicUniverseEngine />
          </CardContent>
        </Card>

        {/* Technology Roadmap */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Revolutionary Features Roadmap</h2>
            <p className="text-muted-foreground">
              A glimpse into the cutting-edge technology that will power the next generation of service marketplaces
            </p>
          </div>

          <Tabs defaultValue="roadmap" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roadmap">Technology Roadmap</TabsTrigger>
              <TabsTrigger value="features">Revolutionary Features</TabsTrigger>
              <TabsTrigger value="impact">Global Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="roadmap" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      Q1 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Self-Healing Marketplace</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Hyper-Personalized AI</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Q2-Q3 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">Quantum AI Matching</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">AR/VR Service Preview</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">Metaverse Marketplace</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-purple-500" />
                      Q4 2025+
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-sm">Web3 DeFi Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-sm">Neuromorphic Edge Computing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-sm">Holographic Demonstrations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <RevolutionaryFeatures />
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Global Reach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">195</div>
                    <p className="text-sm text-muted-foreground">
                      Countries that will benefit from our revolutionary marketplace technology
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      User Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">1B+</div>
                    <p className="text-sm text-muted-foreground">
                      People who will experience next-generation service discovery and booking
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      Efficiency Gains
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">1000x</div>
                    <p className="text-sm text-muted-foreground">
                      Faster matching and decision-making through quantum-enhanced AI algorithms
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent>
                  <h3 className="text-2xl font-bold mb-4">Transforming Industries Worldwide</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Our revolutionary technology will reshape how billions of people discover, experience, 
                    and interact with services across every industry, creating unprecedented efficiency, 
                    trust, and satisfaction.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-semibold text-blue-600">Home Services</div>
                      <div className="text-xs text-muted-foreground">Revolutionary matching</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-semibold text-green-600">Professional Services</div>
                      <div className="text-xs text-muted-foreground">AI-powered discovery</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-semibold text-purple-600">Healthcare</div>
                      <div className="text-xs text-muted-foreground">Predictive wellness</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-semibold text-orange-600">Education</div>
                      <div className="text-xs text-muted-foreground">Personalized learning</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
