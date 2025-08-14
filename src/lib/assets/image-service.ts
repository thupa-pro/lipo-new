// Professional image asset management service
export interface ImageAsset {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  category: 'avatar' | 'hero' | 'service' | 'blog' | 'testimonial' | 'company' | 'icon' | 'feature';
}

// High-quality professional images from Unsplash and other sources
const PROFESSIONAL_IMAGES: Record<string, ImageAsset[]> = {
  avatars: [
    {
      id: 'avatar_1',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of Michael Chen',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_2', 
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of Sarah Johnson',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_3',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of David Rodriguez',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_4',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of Emily Thompson',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_5',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of James Wilson',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_6',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of Lisa Anderson',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_7',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of Robert Garcia',
      width: 150,
      height: 150,
      category: 'avatar'
    },
    {
      id: 'avatar_8',
      url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=150&h=150&fit=crop&crop=face',
      alt: 'Professional headshot of Maria Martinez',
      width: 150,
      height: 150,
      category: 'avatar'
    }
  ],
  
  services: [
    {
      id: 'service_cleaning',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      alt: 'Professional house cleaning service',
      width: 400,
      height: 300,
      category: 'service'
    },
    {
      id: 'service_landscaping',
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      alt: 'Professional landscaping and garden maintenance',
      width: 400,
      height: 300,
      category: 'service'
    },
    {
      id: 'service_handyman',
      url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      alt: 'Professional handyman repair services',
      width: 400,
      height: 300,
      category: 'service'
    },
    {
      id: 'service_plumbing',
      url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
      alt: 'Professional plumbing services',
      width: 400,
      height: 300,
      category: 'service'
    },
    {
      id: 'service_electrical',
      url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
      alt: 'Professional electrical services',
      width: 400,
      height: 300,
      category: 'service'
    },
    {
      id: 'service_painting',
      url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
      alt: 'Professional painting services',
      width: 400,
      height: 300,
      category: 'service'
    }
  ],

  blog: [
    {
      id: 'blog_1',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      alt: 'Business analytics and growth strategies',
      width: 600,
      height: 400,
      category: 'blog'
    },
    {
      id: 'blog_2',
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      alt: 'Technology and digital transformation',
      width: 600,
      height: 400,
      category: 'blog'
    },
    {
      id: 'blog_3',
      url: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=400&fit=crop',
      alt: 'Customer service excellence',
      width: 600,
      height: 400,
      category: 'blog'
    },
    {
      id: 'blog_4',
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
      alt: 'Market trends and insights',
      width: 600,
      height: 400,
      category: 'blog'
    },
    {
      id: 'blog_5',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      alt: 'Professional development and careers',
      width: 600,
      height: 400,
      category: 'blog'
    }
  ],

  testimonials: [
    {
      id: 'testimonial_1',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
      alt: 'Happy customer testimonial',
      width: 80,
      height: 80,
      category: 'testimonial'
    },
    {
      id: 'testimonial_2',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
      alt: 'Satisfied client review',
      width: 80,
      height: 80,
      category: 'testimonial'
    },
    {
      id: 'testimonial_3',
      url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
      alt: 'Customer success story',
      width: 80,
      height: 80,
      category: 'testimonial'
    },
    {
      id: 'testimonial_4',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
      alt: 'Client testimonial photo',
      width: 80,
      height: 80,
      category: 'testimonial'
    }
  ],

  heroes: [
    {
      id: 'hero_main',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop',
      alt: 'Professional team collaboration',
      width: 1200,
      height: 600,
      category: 'hero'
    },
    {
      id: 'hero_services',
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop',
      alt: 'Professional service excellence',
      width: 1200,
      height: 600,
      category: 'hero'
    },
    {
      id: 'hero_technology',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop',
      alt: 'Advanced technology solutions',
      width: 1200,
      height: 600,
      category: 'hero'
    }
  ],

  features: [
    {
      id: 'feature_ai',
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop',
      alt: 'Artificial intelligence technology',
      width: 300,
      height: 200,
      category: 'feature'
    },
    {
      id: 'feature_mobile',
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
      alt: 'Mobile-first design',
      width: 300,
      height: 200,
      category: 'feature'
    },
    {
      id: 'feature_analytics',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      alt: 'Data analytics dashboard',
      width: 300,
      height: 200,
      category: 'feature'
    },
    {
      id: 'feature_security',
      url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
      alt: 'Security and protection',
      width: 300,
      height: 200,
      category: 'feature'
    }
  ],

  companies: [
    {
      id: 'company_logo',
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop',
      alt: 'Loconomy company logo',
      width: 120,
      height: 60,
      category: 'company'
    }
  ]
};

class ImageService {
  private imageCache: Map<string, ImageAsset> = new Map();

  constructor() {
    // Populate cache on initialization
    Object.values(PROFESSIONAL_IMAGES).flat().forEach(image => {
      this.imageCache.set(image.id, image);
    });
  }

  // Get a specific image by ID
  getImage(id: string): ImageAsset | null {
    return this.imageCache.get(id) || null;
  }

  // Get random image from a category
  getRandomImage(category: 'avatar' | 'hero' | 'service' | 'blog' | 'testimonial' | 'company' | 'feature'): ImageAsset {
    const categoryImages = PROFESSIONAL_IMAGES[category === 'avatar' ? 'avatars' : category + 's'] || [];
    if (categoryImages.length === 0) {
      return this.getFallbackImage(category);
    }
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  }

  // Get multiple images from a category
  getImages(category: 'avatar' | 'hero' | 'service' | 'blog' | 'testimonial' | 'company' | 'feature', count?: number): ImageAsset[] {
    const categoryKey = category === 'avatar' ? 'avatars' : category + 's';
    const categoryImages = PROFESSIONAL_IMAGES[categoryKey] || [];
    
    if (!count) return categoryImages;
    
    const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Get avatar for user/provider
  getUserAvatar(userId?: string): ImageAsset {
    if (userId) {
      // Use user ID to consistently return same avatar
      const index = parseInt(userId.replace(/\D/g, '')) % PROFESSIONAL_IMAGES.avatars.length;
      return PROFESSIONAL_IMAGES.avatars[index];
    }
    return this.getRandomImage('avatar');
  }

  // Get service image by service type
  getServiceImage(serviceType: string): ImageAsset {
    const serviceMap: Record<string, string> = {
      'cleaning': 'service_cleaning',
      'home_cleaning': 'service_cleaning',
      'landscaping': 'service_landscaping',
      'handyman': 'service_handyman',
      'plumbing': 'service_plumbing',
      'electrical': 'service_electrical',
      'painting': 'service_painting'
    };

    const imageId = serviceMap[serviceType.toLowerCase()];
    if (imageId) {
      const image = this.getImage(imageId);
      if (image) return image;
    }

    return this.getRandomImage('service');
  }

  // Get blog post image
  getBlogImage(postId?: string): ImageAsset {
    if (postId) {
      const index = parseInt(postId.replace(/\D/g, '')) % PROFESSIONAL_IMAGES.blog.length;
      return PROFESSIONAL_IMAGES.blog[index];
    }
    return this.getRandomImage('blog');
  }

  // Get fallback image for any category
  private getFallbackImage(category: string): ImageAsset {
    return {
      id: `fallback_${category}`,
      url: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop`,
      alt: `Professional ${category} image`,
      width: 400,
      height: 300,
      category: category as any
    };
  }

  // Optimize image URL with parameters
  optimizeImageUrl(image: ImageAsset, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }): string {
    let url = image.url;
    
    if (options) {
      const params = new URLSearchParams();
      if (options.width) params.set('w', options.width.toString());
      if (options.height) params.set('h', options.height.toString());
      if (options.quality) params.set('q', options.quality.toString());
      if (options.format) params.set('fm', options.format);
      
      const separator = url.includes('?') ? '&' : '?';
      url += separator + params.toString();
    }
    
    return url;
  }

  // Preload critical images
  preloadImages(imageIds: string[]): void {
    imageIds.forEach(id => {
      const image = this.getImage(id);
      if (image) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = image.url;
        document.head.appendChild(link);
      }
    });
  }

  // Get responsive image sizes
  getResponsiveImage(image: ImageAsset): {
    src: string;
    srcSet: string;
    sizes: string;
  } {
    const baseSrc = image.url;
    
    return {
      src: baseSrc,
      srcSet: [
        `${this.optimizeImageUrl(image, { width: 400 })} 400w`,
        `${this.optimizeImageUrl(image, { width: 800 })} 800w`,
        `${this.optimizeImageUrl(image, { width: 1200 })} 1200w`
      ].join(', '),
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    };
  }
}

// Create singleton instance
export const imageService = new ImageService();

// Export convenience functions
export const getRandomAvatar = () => imageService.getRandomImage('avatar');
export const getUserAvatar = (userId?: string) => imageService.getUserAvatar(userId);
export const getServiceImage = (serviceType: string) => imageService.getServiceImage(serviceType);
export const getBlogImage = (postId?: string) => imageService.getBlogImage(postId);
export const getHeroImage = () => imageService.getRandomImage('hero');
export const getTestimonialImage = () => imageService.getRandomImage('testimonial');
export const getFeatureImage = () => imageService.getRandomImage('feature');

// Default export
export default imageService;
