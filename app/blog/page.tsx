'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { GlassmorphicContainer } from '@/components/admin/design-system/glassmorphic-container'
import { HolographicText } from '@/components/admin/design-system/holographic-text'
import {
  Search,
  Calendar,
  Tag,
  ArrowRight,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Star,
  Eye,
  MessageCircle,
  Share2,
  Filter,
  Sparkles,
  Brain,
  Lightbulb,
  Target,
} from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI-Powered Local Services: A Neural Revolution',
    date: 'March 15, 2024',
    category: 'AI Innovation',
    author: 'Dr. Sarah Chen',
    readTime: '8 min read',
    views: '2.4k',
    likes: '156',
    image: '🧠',
    summary:
      'Explore how neural networks and quantum computing are transforming the local services landscape, creating unprecedented matching accuracy and user satisfaction.',
    content:
      'Our latest AI breakthrough uses quantum-enhanced algorithms to predict user needs with 96.7% accuracy, revolutionizing how people discover and book local services...',
    featured: true,
    tags: ['AI', 'Innovation', 'Future'],
  },
  {
    id: 2,
    title: '5 Advanced Tips for Hiring Elite Service Professionals',
    date: 'March 10, 2024',
    category: 'Customer Guide',
    author: 'Maya Rodriguez',
    readTime: '6 min read',
    views: '1.8k',
    likes: '89',
    image: '⭐',
    summary:
      "Discover insider secrets to finding top-tier professionals using Loconomy's advanced search algorithms and quality metrics.",
    content:
      'Our AI-powered matching system analyzes over 200 data points to ensure you get connected with the highest quality professionals...',
    featured: false,
    tags: ['Tips', 'Quality', 'Matching'],
  },
  {
    id: 3,
    title: 'Provider Success Strategies: Leveraging AI for 10x Growth',
    date: 'February 28, 2024',
    category: 'Business Growth',
    author: 'Kai Thompson',
    readTime: '12 min read',
    views: '3.2k',
    likes: '247',
    image: '🚀',
    summary:
      'Learn how top providers are using our AI insights and optimization tools to achieve unprecedented business growth and customer satisfaction.',
    content:
      'Providers using our AI optimization tools see an average of 340% increase in bookings and 95% customer satisfaction rates...',
    featured: true,
    tags: ['Growth', 'AI', 'Business'],
  },
  {
    id: 4,
    title: 'Neural Security: Next-Gen Protection for Local Services',
    date: 'February 20, 2024',
    category: 'Security & Trust',
    author: 'Marcus Williams',
    readTime: '10 min read',
    views: '1.5k',
    likes: '92',
    image: '🛡️',
    summary:
      'Dive deep into our quantum-enhanced security systems that protect every transaction with military-grade encryption and AI fraud detection.',
    content:
      'Our neural security network processes millions of data points in real-time to ensure 99.9% protection against fraud and security threats...',
    featured: false,
    tags: ['Security', 'AI', 'Protection'],
  },
  {
    id: 5,
    title: 'Community Impact: How AI Services Transform Local Economies',
    date: 'February 15, 2024',
    category: 'Community',
    author: 'Elena Foster',
    readTime: '7 min read',
    views: '2.1k',
    likes: '134',
    image: '🌟',
    summary:
      'Discover how AI-powered local services are creating economic opportunities and strengthening community connections worldwide.',
    content:
      'Communities using Loconomy see average economic activity increases of 23% and stronger local business networks...',
    featured: false,
    tags: ['Community', 'Economics', 'Impact'],
  },
  {
    id: 6,
    title: 'The Psychology of Perfect Matches: Understanding AI Preferences',
    date: 'February 10, 2024',
    category: 'User Experience',
    author: 'Nova Sterling',
    readTime: '9 min read',
    views: '1.9k',
    likes: '108',
    image: '💫',
    summary:
      'Explore the fascinating science behind how our AI learns your preferences and creates increasingly personalized service recommendations.',
    content:
      'Our neural networks analyze behavioral patterns, communication styles, and satisfaction metrics to create hyper-personalized experiences...',
    featured: false,
    tags: ['Psychology', 'UX', 'Personalization'],
  },
]

const categories = [
  {
    name: 'All Posts',
    count: blogPosts.length,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: 'AI Innovation',
    count: 2,
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    name: 'Customer Guide',
    count: 1,
    color:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'Business Growth',
    count: 1,
    color:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    name: 'Security & Trust',
    count: 1,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: 'Community',
    count: 1,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Posts')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterPosts(query, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterPosts(searchQuery, category)
  }

  const filterPosts = (query: string, category: string) => {
    let filtered = blogPosts

    if (category !== 'All Posts') {
      filtered = filtered.filter((post) => post.category === category)
    }

    if (query) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.summary.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      )
    }

    setFilteredPosts(filtered)
  }

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Header spacing */}
      <div className="h-20 md:h-24"></div>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <BookOpen className="w-4 h-4 mr-2" />
              Loconomy Blog
            </Badge>

            <HolographicText className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              AI-Powered Insights & Stories
            </HolographicText>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover the latest trends, insights, and stories from the world
              of AI-powered local services. Learn from experts, grow your
              business, and stay ahead of the curve.
            </p>

            {/* Search and Filter */}
            <GlassmorphicContainer
              variant="subtle"
              className="max-w-2xl mx-auto"
            >
              <div className="p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search articles, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 text-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/40 focus:border-blue-400 focus:ring-blue-400/30 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      size="sm"
                      variant={
                        selectedCategory === category.name
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handleCategoryFilter(category.name)}
                      className={`text-xs ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80'
                      }`}
                    >
                      {category.name}
                      <Badge className={`ml-2 text-xs ${category.color}`}>
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </GlassmorphicContainer>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Featured Articles
              </Badge>
              <HolographicText className="text-3xl md:text-4xl font-bold mb-4">
                Editor's Picks
              </HolographicText>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our most insightful and impactful articles, hand-selected by our
                editorial team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <EnhancedCard
                  key={post.id}
                  variant="interactive"
                  className="hover:scale-[1.02] transition-all duration-500 h-full"
                >
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-6xl relative">
                      {post.image}
                      <div className="absolute inset-0 bg-black/20" />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-purple-700 font-semibold">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>

                  <EnhancedCardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.likes}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <EnhancedButton asChild className="w-full">
                        <Link href={`/blog/${post.id}`}>
                          Read Full Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </EnhancedButton>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <HolographicText className="text-3xl md:text-4xl font-bold mb-4">
              Latest Articles
            </HolographicText>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest insights, tips, and innovations in
              AI-powered local services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <EnhancedCard
                key={post.id}
                variant="glass"
                className="hover:scale-105 transition-all duration-500 h-full group"
              >
                <div className="relative overflow-hidden rounded-t-3xl">
                  <div className="h-40 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                    {post.image}
                  </div>
                </div>

                <EnhancedCardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {post.category}
                    </Badge>
                    <div className="text-xs text-gray-500">{post.readTime}</div>
                  </div>

                  <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
                  >
                    <Link href={`/blog/${post.id}`}>
                      Read More
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="text-4xl mb-6">🧠</div>
          <HolographicText className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Stay Ahead with AI Insights
          </HolographicText>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Get the latest articles, AI innovations, and industry insights
            delivered to your inbox weekly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/90 text-gray-900 border-white/40 focus:border-white focus:ring-white/30"
            />
            <EnhancedButton className="bg-white text-gray-900 hover:bg-gray-100 px-8">
              <Brain className="w-4 h-4 mr-2" />
              Subscribe
            </EnhancedButton>
          </div>

          <p className="text-sm opacity-75 mt-4">
            Join 10,000+ professionals getting weekly AI insights
          </p>
        </div>
      </section>
    </div>
  )
}
