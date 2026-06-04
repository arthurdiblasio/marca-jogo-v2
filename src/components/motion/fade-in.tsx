"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
