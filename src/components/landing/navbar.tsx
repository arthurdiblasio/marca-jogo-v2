import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <Logo className="h-8 w-auto" />
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
