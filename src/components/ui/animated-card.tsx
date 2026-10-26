"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

export interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

/**
 * AnimatedCard
 * Provides a standardized hide-then-show entrance animation and subtle hover elevation
 * for any card in the application, matching the KPI metric cards.
 */
export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl border border-border bg-card shadow-sh-sm transition-shadow ${
        hover ? "hover:border-border/80 hover:shadow-sh-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
