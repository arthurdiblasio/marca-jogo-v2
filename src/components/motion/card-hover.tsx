"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function CardHover({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
