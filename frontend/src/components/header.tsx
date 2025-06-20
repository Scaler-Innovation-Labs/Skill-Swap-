"use client";

import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './user-menu';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#browse-skills", label: "Browse Skills" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/learn", label: "Learn" }
  ];

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.svg
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
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </motion.svg>
            <span className="font-bold text-xl">SkillSwap</span>
          </Link>
        </motion.div>
        
        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 hover:bg-accent rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  href={item.href} 
                  className="text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  <span className="relative">
                    {item.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                      whileHover={{ width: "100%" }}
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ModeToggle />
            {!loading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link href="/signin">
                      <Button 
                        variant="ghost" 
                        className="hover:animate-pulse-glow"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button 
                        variant="gradient" 
                        className="animate-pulse-glow hover:animate-shake group"
                      >
                        <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-4 space-y-4">
              <nav className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      href={item.href} 
                      className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 block hover:bg-accent rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div 
                className="flex flex-col gap-2 pt-4 border-t"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ModeToggle />
                </div>
                {!loading && (
                  <>
                    {user ? (
                      <div className="px-2">
                        <UserMenu />
                      </div>
                    ) : (
                      <>
                        <Link href="/signin" className="w-full">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start hover:animate-pulse-glow"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/signup" className="w-full">
                          <Button 
                            variant="gradient" 
                            className="w-full justify-start animate-pulse-glow hover:animate-shake group"
                          >
                            <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}