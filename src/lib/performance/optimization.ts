interface PerformanceMetrics {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isMonitoring = false;
  private metrics: Partial<PerformanceMetrics> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.isMonitoring = true;
    this.collectMetrics();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  private collectMetrics(): void {
    try {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      }

      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.FCP = fcp.startTime;
      }

      // Simulate other metrics for demo
      this.metrics.LCP = (this.metrics.FCP || 0) + Math.random() * 1000 + 1000;
      this.metrics.FID = Math.random() * 50;
      this.metrics.CLS = Math.random() * 0.1;

    } catch (error) {
      console.warn('Performance metrics collection failed:', error);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
}

export function optimizeForNetwork(connectionType: string): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  switch (connectionType) {
    case '2g':
    case 'slow-2g':
      root.setAttribute('data-connection', 'slow');
      // Reduce image quality, disable animations
      root.style.setProperty('--animation-speed', '0');
      break;
    case '3g':
      root.setAttribute('data-connection', 'medium');
      root.style.setProperty('--animation-speed', '0.5');
      break;
    default:
      root.setAttribute('data-connection', 'fast');
      root.style.setProperty('--animation-speed', '1');
  }
}

export function preloadCriticalResources(): void {
  if (typeof document === 'undefined') return;

  const resources = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/_next/static/css/app.css', as: 'style' },
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.as === 'font') link.crossOrigin = 'anonymous';
    
    if (!document.head.querySelector(`link[href="${resource.href}"]`)) {
      document.head.appendChild(link);
    }
  });
}

export function setupImageOptimization(): void {
  if (typeof window === 'undefined') return;

  // Lazy loading with Intersection Observer
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
  }
}
