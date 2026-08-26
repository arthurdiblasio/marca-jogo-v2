"use client";

import {
  Goal,
  CircleDot,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";

export function FootballLoading({
  overlay = false,
}: {
  overlay?: boolean;
}) {
  return (
    <div
      className={
        overlay
          ? `
            fixed
            inset-0
            z-50
            flex
            flex-col
            items-center
            justify-center
            bg-slate-950
            text-white
          `
          : `
            flex
            min-h-screen
            flex-col
            items-center
            justify-center
            bg-slate-950
            text-white
          `
      }
    >
      <div className="mb-8">
        <Logo className="h-10 w-auto" />
      </div>

      <div
        className="
          relative
          h-12
          w-72
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-0
            top-1/2
            -translate-y-1/2
            animate-football
          "
        >
          <CircleDot className="h-8 w-8" />
        </div>

        <div
          className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
          "
        >
          <Goal className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Preparando sua partida...
      </p>
    </div>
  );
}