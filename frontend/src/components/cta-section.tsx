"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Star, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function CTASection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stats = [
    {
      number: "10,000+",
      label: "Active Users",
      description: "Students and professionals using SkillSwap daily.",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "25,000+",
      label: "Skills Exchanged",
      description: "Learning sessions completed on our platform.",
      icon: <Zap className="h-6 w-6" />
    },
    {
      number: "200+",
      label: "Different Skills",
      description: "From programming to painting, Excel to electronics.",
      icon: <Star className="h-6 w-6" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background particles - only render on client */}
      {isClient && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-0 shadow-2xl relative overflow-hidden">
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <CardContent className="p-0 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <motion.div 
                  className="p-8 lg:p-12"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.h2 
                    className="text-3xl font-bold tracking-tight mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Ready to exchange skills and expand your horizons?
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground text-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Join thousands of students and professionals who are already growing through collaborative learning.
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <Link href="/signup">
                      <Button 
                        variant="gradient" 
                        size="xl" 
                        className="gap-2 btn-responsive animate-pulse-glow hover:animate-shake group"
                      >
                        <Sparkles className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                        Get Started 
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                    <Link href="/how-it-works">
                      <Button 
                        variant="neon" 
                        size="xl" 
                        className="btn-responsive animate-neon-flicker hover:animate-wiggle"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="relative h-60 lg:h-auto overflow-hidden rounded-b-lg lg:rounded-l-none lg:rounded-r-lg"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <motion.img 
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Students collaborating" 
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Floating sparkles over image */}
                  <motion.div
                    className="absolute top-4 right-4 text-yellow-400"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              number={stat.number}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ number, label, description, icon, variants }) {
  return (
    <motion.div 
      className="text-center p-6 bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      variants={variants}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="relative z-10"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      
      <motion.p 
        className="text-4xl font-bold text-primary mb-2 relative z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        viewport={{ once: true }}
      >
        {number}
      </motion.p>
      <motion.p 
        className="text-xl font-medium mb-2 relative z-10"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.p>
      <motion.p 
        className="text-muted-foreground relative z-10"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        {description}
      </motion.p>

      {/* Floating particles */}
      <motion.div
        className="absolute top-2 right-2 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100"
        animate={{ 
          y: [0, -8, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          delay: 0.5
        }}
      />
    </motion.div>
  );
}