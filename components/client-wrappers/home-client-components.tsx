'use client';

import { IntelligentHeader } from '@/components/ui/intelligent-header';
import { PWAProvider } from '@/components/ui/pwa-features';
import { CommandPaletteHint } from '@/components/ui/command-palette-hint';
import { FloatingFAB, MobileBottomNav } from '@/components/ui/floating-fab';

interface HomeClientComponentsProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function HomeClientComponents({ children, currentPath = "/" }: HomeClientComponentsProps) {
  return (
    <PWAProvider>
      <IntelligentHeader />
      {children}
      <CommandPaletteHint />
      <FloatingFAB />
      <MobileBottomNav currentPath={currentPath} />
    </PWAProvider>
  );
}
