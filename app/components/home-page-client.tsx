'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Search, MapPin, Briefcase } from 'lucide-react';

export function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSearch = () => {
    if (searchQuery.trim() || locationQuery.trim()) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (locationQuery.trim()) params.set('location', locationQuery.trim());
      router.push(`/browse?${params.toString()}`);
    } else {
      toast({
        title: "Search Query Required",
        description: "Please enter a service or location to search",
        variant: "destructive",
      });
    }
  };

  const handleQuickSearch = (tag: string) => {
    setSearchQuery(tag);
    const params = new URLSearchParams();
    params.set('q', tag);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 landscape-compact" id="find-service" role="search" aria-labelledby="search-title">
      <div className="search-card card-elite resp-p-6 hover-scale mx-2 sm:mx-4 md:mx-0 animate-elite-float">
        <h2 id="search-title" className="section-title resp-text-xl md:text-3xl lg:text-4xl font-heading text-center mb-2">Start Your Search</h2>
        <p className="section-subtitle text-center mb-4 sm:mb-6 md:mb-10 font-body resp-text-sm">Get matched with the perfect professional in seconds.</p>

        <div className="max-w-4xl mx-auto">
          <div className="search-input-container flex flex-col sm:flex-row items-center p-2 md:p-3 rounded-full">
            <div className="flex-grow w-full flex items-center pl-2 sm:pl-3 md:pl-4 pr-2">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--mid-gray)] mr-2 md:mr-3" />
              <input
                className="search-input w-full focus:outline-none py-2 md:py-3 resp-text-sm md:text-lg"
                placeholder="What service do you need?"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Service type"
                id="service-input"
              />
            </div>
            <div className="w-full sm:w-auto flex items-center pl-2 sm:pl-3 md:pl-4 pr-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-white/10 mt-2 sm:mt-0 pt-2 sm:pt-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500 dark:text-[var(--mid-gray)] mr-2 md:mr-3" />
              <input
                className="search-input w-full focus:outline-none py-2 md:py-3 resp-text-sm md:text-lg"
                placeholder="Your Location"
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                aria-label="Service location"
                id="location-input"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-3 sm:mt-0 sm:w-auto px-4 sm:px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-ui font-semibold rounded-full btn-glow transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex-shrink-0 touch-target resp-text-sm"
              aria-label="Search for services"
            >
              <span className="hidden sm:inline">Search</span>
              <Search className="w-4 h-4 sm:hidden" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 sm:mt-6 md:mt-8 resp-text-xs">
            {['House Cleaning', 'Plumber', 'Electrician', 'Personal Trainer', 'Math Tutor'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickSearch(tag)}
                className="search-tag interactive-element px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full transition-all duration-300 touch-target"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
