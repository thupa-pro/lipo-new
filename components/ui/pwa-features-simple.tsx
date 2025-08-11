'use client'

import { ReactNode } from 'react'

interface PWAProviderProps {
  children: ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  return <>{children}</>
}
