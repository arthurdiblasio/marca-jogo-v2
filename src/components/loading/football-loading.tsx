"use client";

import {
  Goal,
  CircleDot,
} from "lucide-react";

export function FootballLoading() {
  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        bg-slate-950
        text-white
      "
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">
          Marca Jogo
        </h1>
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

      <p className="mt-6 text-sm text-slate-400">
        Preparando sua partida...
      </p>
    </div>
  );
}