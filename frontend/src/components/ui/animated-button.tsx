"use client";

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'explosion' | 'magnetic' | 'wave' | 'neon' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  className,
  variant = 'explosion',
  size = 'md',
  onClick,
  disabled = false
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 1000);
  };

  const handleClick = () => {
    if (variant === 'explosion') {
      createParticles();
    }
    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    explosion: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl',
    magnetic: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg',
    wave: 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg',
    neon: 'bg-transparent border-2 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-400/50',
    gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg'
  };

  const renderParticles = () => (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            x: particle.x, 
            y: particle.y, 
            scale: 0, 
            opacity: 0 
          }}
          transition={{ 
            duration: 1, 
            ease: "easeOut" 
          }}
        />
      ))}
    </>
  );

  const renderWaveEffect = () => (
    <motion.div
      className="absolute inset-0 rounded-lg bg-white/20"
      initial={{ scale: 0, opacity: 1 }}
      animate={isPressed ? { scale: 1, opacity: 0 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.6 }}
    />
  );

  const renderNeonEffect = () => (
    <motion.div
      className="absolute inset-0 rounded-lg bg-cyan-400/20"
      animate={{
        boxShadow: [
          "0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff",
          "0 0 2px #00ffff, 0 0 5px #00ffff, 0 0 8px #00ffff",
          "0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff"
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  return (
    <div className="relative inline-block">
      <motion.button
        ref={buttonRef}
        className={cn(
          "relative overflow-hidden rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        style={
          variant === 'magnetic' 
            ? { 
                transformStyle: "preserve-3d",
                transform: isHovered ? "perspective(1000px)" : "none"
              }
            : {}
        }
        animate={
          variant === 'magnetic' && isHovered
            ? { rotateX, rotateY, scale: 1.05 }
            : variant === 'wave'
            ? { scale: isPressed ? 0.95 : 1 }
            : { scale: isPressed ? 0.95 : 1 }
        }
        whileHover={
          variant === 'magnetic'
            ? { scale: 1.05 }
            : { scale: 1.05 }
        }
        whileTap={{ scale: 0.95 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={handleClick}
        disabled={disabled}
      >
        {/* Background effects */}
        {variant === 'wave' && renderWaveEffect()}
        {variant === 'neon' && renderNeonEffect()}
        
        {/* Gradient animation for gradient variant */}
        {variant === 'gradient' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Content */}
        <motion.span
          className="relative z-10 flex items-center justify-center"
          style={
            variant === 'magnetic' && isHovered
              ? { transform: "translateZ(20px)" }
              : {}
          }
        >
          {children}
        </motion.span>

        {/* Particles for explosion variant */}
        {variant === 'explosion' && renderParticles()}

        {/* Magnetic hover effect */}
        {variant === 'magnetic' && isHovered && (
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-lg"
            style={{
              transform: "translateZ(10px)",
            }}
          />
        )}
      </motion.button>
    </div>
  );
} 