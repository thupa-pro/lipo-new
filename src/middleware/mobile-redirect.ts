import { NextRequest, NextResponse } from 'next/server';

interface DeviceDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  userAgent: string;
}

function detectDevice(request: NextRequest): DeviceDetectionResult {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // Mobile patterns
  const mobilePatterns = [
    /android/,
    /webos/,
    /iphone/,
    /ipod/,
    /blackberry/,
    /windows phone/,
    /mobile/
  ];
  
  // Tablet patterns (more specific)
  const tabletPatterns = [
    /ipad/,
    /android(?!.*mobile)/,
    /tablet/,
    /kindle/,
    /silk/,
    /playbook/
  ];
  
  const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
  const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent)) && !isMobile;
  
  return {
    isMobile,
    isTablet,
    userAgent
  };
}

export function createMobileRedirectMiddleware() {
  return function mobileRedirectMiddleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const deviceInfo = detectDevice(request);
    
    // Skip if already on mobile route
    if (pathname.startsWith('/mobile')) {
      return NextResponse.next();
    }
    
    // Skip API routes and static files
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.') // Static files
    ) {
      return NextResponse.next();
    }
    
    // Optional: Redirect mobile users to /mobile route
    // Uncomment the block below to enable automatic mobile redirect
    /*
    if (deviceInfo.isMobile) {
      const mobileUrl = new URL(`/mobile${pathname === '/' ? '' : pathname}${search}`, request.url);
      return NextResponse.redirect(mobileUrl);
    }
    */
    
    // Add device info to headers for components to use
    const response = NextResponse.next();
    response.headers.set('x-device-mobile', deviceInfo.isMobile.toString());
    response.headers.set('x-device-tablet', deviceInfo.isTablet.toString());
    response.headers.set('x-user-agent', deviceInfo.userAgent);
    
    return response;
  };
}

// Export the default middleware
export const mobileRedirectMiddleware = createMobileRedirectMiddleware();
