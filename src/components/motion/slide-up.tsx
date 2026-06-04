"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function SlideUp({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
