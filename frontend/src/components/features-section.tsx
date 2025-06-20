"use client";

import { BookOpen, Calendar, Users, Video, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeaturesSection() {
  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>,
      title: "Safe & Secure",
      description: "All sessions are verified and monitored to ensure a safe learning environment for everyone.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
      title: "Quality Guaranteed",
      description: "Every teacher is verified and rated by the community to maintain high-quality learning experiences.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      title: "No Money Needed",
      description: "Exchange your skills directly with others - no payment required, just your time and knowledge.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title: "Community Driven",
      description: "Join a vibrant community of learners and teachers passionate about sharing knowledge.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      title: "Flexible Learning",
      description: "Schedule sessions that fit your timetable and learn at your own pace.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>,
      title: "Skill Verification",
      description: "Get your skills verified by the community and build a trusted teaching profile.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="browse-skills" className="py-12 sm:py-16 md:py-20 scroll-mt-16">
      <div className="container px-4 sm:px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Choose SkillSwap?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our platform makes skill exchange simple, efficient, and enjoyable.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              variants={cardVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, color, variants }) {
  return (
    <motion.div 
      className="bg-card p-4 sm:p-6 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full relative overflow-hidden group"
      variants={variants}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="p-2 w-fit rounded-full bg-primary/10 mb-3 sm:mb-4 relative z-10"
        whileHover={{ 
          scale: 1.2,
          rotate: 360,
          transition: { duration: 0.5 }
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 relative z-10"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-sm sm:text-base text-muted-foreground relative z-10"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        {description}
      </motion.p>

      {/* Floating particles effect */}
      <motion.div
        className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-2 left-2 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100"
        animate={{ 
          y: [0, -8, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          delay: 1
        }}
      />
    </motion.div>
  );
}