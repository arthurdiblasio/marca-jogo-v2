"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  async function handleConfirm() {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // caller is responsible for surfacing the error (e.g. a toast); keep the dialog open so the user can retry
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => !isSubmitting && onOpenChange(false)}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-lg border bg-card p-5 text-card-foreground shadow-modal"
          >
            <div className="flex items-start gap-3">
              {variant === "destructive" && (
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/10">
                  <AlertTriangle className="size-5 text-amber-500" />
                </div>
              )}
              <div className="min-w-0">
                <h2 id="confirm-dialog-title" className="font-black text-foreground">
                  {title}
                </h2>
                {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                className={cn("flex-1", variant === "destructive" && "bg-rose-600 shadow-none hover:bg-rose-700")}
                disabled={isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? "Aguarde..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
