"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, UserPlus, Sparkles, Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
}

export function FloatingFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  const actions: FABAction[] = [
    {
      id: 'search',
      label: 'Find Services',
      icon: Search,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => router.push('/browse'),
    },
    {
      id: 'book',
      label: 'Quick Book',
      icon: Zap,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => router.push('/post-job'),
    },
    {
      id: 'provider',
      label: 'Become Provider',
      icon: UserPlus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => router.push('/become-provider'),
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      icon: Sparkles,
      color: 'bg-fuchsia-500 hover:bg-fuchsia-600',
      action: () => {
        // Open AI assistant
        console.log('AI Assistant coming soon!');
      },
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide FAB when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleActionClick = (action: FABAction) => {
    action.action();
    setIsOpen(false);
  };

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 transition-all duration-500 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}>
        {/* Action Buttons */}
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <div
              key={action.id}
              className={cn(
                "flex items-center space-x-3 transition-all duration-300",
                isOpen 
                  ? "translate-y-0 opacity-100 scale-100" 
                  : "translate-y-8 opacity-0 scale-95"
              )}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              {/* Label */}
              <div className="px-3 py-2 bg-gray-900/95 text-white text-sm font-ui font-medium rounded-full backdrop-blur-xl border border-gray-700/50 shadow-lg">
                {action.label}
              </div>
              
              {/* Action Button */}
              <button
                onClick={() => handleActionClick(action)}
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                  action.color,
                  "hover:scale-110 hover:shadow-xl active:scale-95"
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </button>
            </div>
          );
        })}

        {/* Main FAB */}
        <button
          onClick={toggleFAB}
          className={cn(
            "w-14 h-14 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full shadow-xl",
            "transition-all duration-300 flex items-center justify-center",
            "hover:scale-110 hover:shadow-2xl active:scale-95",
            "border-2 border-white/10 backdrop-blur-xl",
            isOpen && "rotate-45"
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-300" />
          ) : (
            <Plus className="w-6 h-6 text-white transition-transform duration-300" />
          )}
        </button>
      </div>
    </>
  );
}

interface MobileBottomNavProps {
  currentPath?: string;
}

export function MobileBottomNav({ currentPath = '/' }: MobileBottomNavProps) {
  const router = useRouter();
  
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      path: '/',
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: '/browse',
    },
    {
      id: 'book',
      label: 'Book',
      icon: Zap,
      path: '/post-job',
    },
    {
      id: 'provider',
      label: 'Provider',
      icon: UserPlus,
      path: '/become-provider',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      path: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1",
                  "transition-all duration-200 font-ui",
                  isActive 
                    ? "text-purple-400" 
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                <div className={cn(
                  "p-1 rounded-lg transition-colors duration-200",
                  isActive && "bg-purple-500/20"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium",
                  isActive && "text-purple-400"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
