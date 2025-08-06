"use client";

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  threshold?: number;
  triggerOnce?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 600,
  direction = 'up',
  threshold = 0.1,
  triggerOnce = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [isClient, threshold, triggerOnce]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    
    switch (direction) {
      case 'up':
        return 'translate3d(0, 40px, 0) scale(0.95)';
      case 'down':
        return 'translate3d(0, -40px, 0) scale(0.95)';
      case 'left':
        return 'translate3d(40px, 0, 0) scale(0.95)';
      case 'right':
        return 'translate3d(-40px, 0, 0) scale(0.95)';
      case 'scale':
        return 'translate3d(0, 0, 0) scale(0.8)';
      case 'fade':
        return 'translate3d(0, 0, 0) scale(1)';
      default:
        return 'translate3d(0, 40px, 0) scale(0.95)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn('transition-all ease-out', className)}
      style={{
        transform: isClient ? getTransform() : 'translate3d(0, 40px, 0) scale(0.95)',
        opacity: isClient && isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

interface StaggeredRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
}

export function StaggeredReveal({
  children,
  className,
  staggerDelay = 100,
  direction = 'up',
}: StaggeredRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          delay={index * staggerDelay}
          direction={direction}
          className="relative"
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

interface ParallaxRevealProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export function ParallaxReveal({
  children,
  className,
  speed = 0.5,
  direction = 'vertical',
}: ParallaxRevealProps) {
  const [offset, setOffset] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      if (direction === 'vertical') {
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient, speed, direction]);

  return (
    <div
      ref={elementRef}
      className={cn('transition-transform', className)}
      style={{
        transform: direction === 'vertical' 
          ? `translate3d(0, ${offset}px, 0)` 
          : `translate3d(${offset}px, 0, 0)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
