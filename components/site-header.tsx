"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loconomy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/browse"
                      >
                        <Sparkles className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Browse Services
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Find verified service providers in your area
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <Link href="/request-service" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Request Service</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Post your service request and get quotes
                    </p>
                  </Link>
                  <Link href="/ai-demo" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">AI Assistant</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Get AI-powered service recommendations
                    </p>
                  </Link>
                  <Link href="/gig-map" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Gig Map</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View real-time jobs on interactive map
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>For Providers</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px]">
                  <Link href="/become-provider" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Become a Provider</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Join our platform and grow your business
                    </p>
                  </Link>
                  <Link href="/provider-resources" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Resources</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Tools and guides for providers
                    </p>
                  </Link>
                  <Link href="/provider-support" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Support</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Get help with your provider account
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                Pricing
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                About
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
            <Link href="/browse" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">
              Browse Services
            </Link>
            <Link href="/become-provider" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">
              Become Provider
            </Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">
              Pricing
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">
              About
            </Link>
            <div className="border-t pt-3 mt-3">
              <Link href="/auth/signin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">
                Sign In
              </Link>
              <Link href="/auth/signup" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
