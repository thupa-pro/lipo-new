import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Clock, Star, ArrowRight } from 'lucide-react';

interface SimpleHeroProps {
  stats: {
    userCount: number;
    providerCount: number;
    bookingCount: number;
    averageRating: number;
    responseTime: string;
    successRate: string;
  };
}

export function SimpleHero({ stats }: SimpleHeroProps) {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Trust Badge */}
        <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
          Trusted by {(stats.userCount / 1000000).toFixed(1)}M+ Users Worldwide
        </Badge>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Local Services
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            AI-powered matching
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Connect with verified local service professionals through our intelligent platform. 
          From home repairs to personal training - find trusted providers with AI-powered matching.
        </p>

        {/* Simple Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none"
              />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <Link href="/post-job">
            <div className="group cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">Post a Job</h3>
                  <p className="text-blue-100 text-sm">Get matched instantly</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/browse">
            <div className="group cursor-pointer bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">Find Work</h3>
                  <p className="text-green-100 text-sm">Browse available jobs</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(stats.userCount / 1000000).toFixed(1)}M+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl w-fit mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.responseTime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl w-fit mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.averageRating}/5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl w-fit mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.successRate}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
