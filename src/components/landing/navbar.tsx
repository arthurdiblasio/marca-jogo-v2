import Link from "next/link";

import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
            <Shield className="h-5 w-5 text-white" />
          </div>

          <span className="text-lg font-extrabold text-white">
            Marca Jogo
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
            >
              Entrar
            </Button>
          </Link>

          <Link href="/register">
            <Button size="sm">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}