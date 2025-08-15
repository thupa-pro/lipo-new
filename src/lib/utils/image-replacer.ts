import { imageService, getUserAvatar, getServiceImage, getBlogImage, getRandomAvatar, getTestimonialImage } from '@/lib/assets/image-service';

// Utility to replace placeholder images based on context
export function replaceImage(placeholderSrc: string, context?: {
  type?: 'avatar' | 'service' | 'blog' | 'testimonial' | 'feature';
  userId?: string;
  serviceType?: string;
  postId?: string;
  alt?: string;
}) {
  // If it's not a placeholder, return as is
  if (!placeholderSrc.includes('placeholder')) {
    return placeholderSrc;
  }

  // Determine image type from context or URL
  const { type, userId, serviceType, postId, alt } = context || {};

  switch (type) {
    case 'avatar':
      return getUserAvatar(userId).url;
    
    case 'service':
      return getServiceImage(serviceType || 'general').url;
    
    case 'blog':
      return getBlogImage(postId).url;
    
    case 'testimonial':
      return getTestimonialImage().url;
    
    case 'feature':
      return imageService.getRandomImage('feature').url;
    
    default:
      // Try to infer from alt text or URL
      if (alt?.toLowerCase().includes('avatar') || placeholderSrc.includes('avatar')) {
        return getRandomAvatar().url;
      }
      if (alt?.toLowerCase().includes('service') || placeholderSrc.includes('service')) {
        return getServiceImage('general').url;
      }
      if (alt?.toLowerCase().includes('blog') || placeholderSrc.includes('blog')) {
        return getBlogImage().url;
      }
      if (alt?.toLowerCase().includes('testimonial') || placeholderSrc.includes('testimonial')) {
        return getTestimonialImage().url;
      }
      
      // Default fallback
      return getRandomAvatar().url;
  }
}

// Batch replace multiple images
export function replaceImages(images: Array<{
  src: string;
  context?: {
    type?: 'avatar' | 'service' | 'blog' | 'testimonial' | 'feature';
    userId?: string;
    serviceType?: string;
    postId?: string;
    alt?: string;
  };
}>) {
  return images.map(({ src, context }) => replaceImage(src, context));
}

// Generate contextual image for common patterns
export function getContextualImage(context: {
  category: 'user' | 'provider' | 'service' | 'blog' | 'testimonial' | 'admin';
  id?: string;
  metadata?: Record<string, any>;
}) {
  const { category, id, metadata } = context;

  switch (category) {
    case 'user':
    case 'provider':
      return getUserAvatar(id);
    
    case 'service':
      return getServiceImage(metadata?.serviceType || metadata?.category || 'general');
    
    case 'blog':
      return getBlogImage(id);
    
    case 'testimonial':
      return getTestimonialImage();
    
    case 'admin':
      return imageService.getRandomImage('feature');
    
    default:
      return getRandomAvatar();
  }
}
