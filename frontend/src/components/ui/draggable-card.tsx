"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "framer-motion";

export const DraggableCardBody = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [15, -15]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-15, 15]),
    springConfig,
  );

  const scale = useSpring(1, {
    stiffness: 400,
    damping: 25,
  });

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.95, 1, 0.95]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.1, 0, 0.1]),
    springConfig,
  );

  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        const parentElement = cardRef.current?.parentElement;
        if (parentElement) {
          const parentRect = parentElement.getBoundingClientRect();
          setConstraints({
            top: -parentRect.height / 4,
            left: -parentRect.width / 4,
            right: parentRect.width / 4,
            bottom: parentRect.height / 4,
          });
        }
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      dragElastic={0.1}
      onDragStart={() => {
        setIsDragging(true);
        document.body.style.cursor = "grabbing";
        scale.set(1.02);
      }}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        document.body.style.cursor = "default";
        scale.set(1);

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });

        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();
        const velocityMagnitude = Math.sqrt(
          currentVelocityX * currentVelocityX +
            currentVelocityY * currentVelocityY,
        );
        const bounce = Math.min(0.6, velocityMagnitude / 1000);

        animate(info.point.x, info.point.x + currentVelocityX * 0.2, {
          duration: 0.6,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 60,
          damping: 20,
          mass: 0.8,
        });

        animate(info.point.y, info.point.y + currentVelocityY * 0.2, {
          duration: 0.6,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 60,
          damping: 20,
          mass: 0.8,
        });
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        scale,
        willChange: "transform",
      }}
      animate={controls}
      whileHover={{ scale: isDragging ? 1.02 : 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-xl bg-card p-6 shadow-xl transform-3d backdrop-blur-sm border border-border/50",
        "hover:shadow-2xl hover:border-border/80 transition-shadow duration-300",
        className,
      )}
    >
      {children}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white via-white to-transparent dark:from-white/10 dark:via-white/10 dark:to-transparent select-none"
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("[perspective:3000px] w-full", className)}>{children}</div>
  );
};
