"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function PageTransition({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
