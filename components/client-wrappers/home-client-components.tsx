'use client';

import { SimpleHeader } from '@/components/ui/simple-header';

interface HomeClientComponentsProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function HomeClientComponents({ children, currentPath = "/" }: HomeClientComponentsProps) {
  return (
    <>
      <SimpleHeader />
      {children}
    </>
  );
}
