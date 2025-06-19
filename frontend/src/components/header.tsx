"use client";

import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b' : 'bg-transparent'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="font-bold text-xl">SkillSwap</span>
        </Link>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 hover:bg-accent rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6">
            <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/#browse-skills" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Skills
            </Link>
            <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
              Learn
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/#how-it-works" 
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/#browse-skills" 
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Skills
              </Link>
              <Link 
                href="/#pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/learn" 
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Learn
              </Link>
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ModeToggle />
              </div>
              <Link href="/signin" className="w-full">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full justify-start">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}