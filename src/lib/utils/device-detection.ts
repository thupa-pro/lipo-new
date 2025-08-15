'use client';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    // SSR fallback
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenSize: 'lg',
      userAgent: '',
      viewport: { width: 1024, height: 768 }
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Mobile detection patterns
  const mobilePatterns = [
    /android/,
    /webos/,
    /iphone/,
    /ipad/,
    /ipod/,
    /blackberry/,
    /windows phone/,
    /mobile/
  ];

  // Tablet detection patterns
  const tabletPatterns = [
    /ipad/,
    /android(?!.*mobile)/,
    /tablet/,
    /kindle/,
    /silk/,
    /playbook/
  ];

  const isMobileUA = mobilePatterns.some(pattern => pattern.test(userAgent));
  const isTabletUA = tabletPatterns.some(pattern => pattern.test(userAgent));

  // Screen size based detection
  const isMobileScreen = width < 768;
  const isTabletScreen = width >= 768 && width < 1024;
  const isDesktopScreen = width >= 1024;

  // Combine UA and screen size detection
  const isMobile = isMobileUA || isMobileScreen;
  const isTablet = (isTabletUA || isTabletScreen) && !isMobile;
  const isDesktop = !isMobile && !isTablet;

  // Determine screen size class
  let screenSize: DeviceInfo['screenSize'] = 'lg';
  if (width < 480) screenSize = 'xs';
  else if (width < 640) screenSize = 'sm';
  else if (width < 768) screenSize = 'md';
  else if (width < 1024) screenSize = 'lg';
  else if (width < 1280) screenSize = 'xl';
  else screenSize = '2xl';

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    userAgent,
    viewport: { width, height }
  };
}

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenSize: 'lg',
        userAgent: '',
        viewport: { width: 1024, height: 768 }
      };
    }
    return getDeviceInfo();
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only update device info on mount, not on every resize to improve performance
    setDeviceInfo(getDeviceInfo());
  }, []);

  return deviceInfo;
}

// React import for useDeviceDetection hook
import React from 'react';

export function redirectToMobileIfNeeded() {
  if (typeof window === 'undefined') return;
  
  const deviceInfo = getDeviceInfo();
  const currentPath = window.location.pathname;
  
  // Only redirect if on mobile and not already on /mobile route
  if (deviceInfo.isMobile && !currentPath.startsWith('/mobile')) {
    // Preserve query parameters and hash
    const search = window.location.search;
    const hash = window.location.hash;
    const newPath = `/mobile${currentPath === '/' ? '' : currentPath}${search}${hash}`;
    
    window.location.href = newPath;
  }
}
