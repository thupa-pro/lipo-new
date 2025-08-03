/**
 * Utility functions for handling avatar images and fallbacks
 */

export function getAvatarFallback(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarSrc(avatar?: string | null): string {
  if (avatar && !avatar.includes('placeholder.svg')) {
    return avatar;
  }
  return '/avatar-fallback.svg';
}

export function generateColorFromName(name: string): string {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-rose-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-green-500',
    'from-orange-500 to-red-500',
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

export function getImageSrcWithFallback(src?: string | null, type: 'avatar' | 'image' = 'avatar'): string {
  if (src && !src.includes('placeholder.svg')) {
    return src;
  }
  
  return type === 'avatar' ? '/avatar-fallback.svg' : '/icon.svg';
}
