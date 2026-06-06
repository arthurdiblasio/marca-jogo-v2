import Link from "next/link";

import {
  ArrowRight,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-md px-6 py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-600">
          <Shield className="h-7 w-7" />
        </div>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight">
          Organize suas peladas como um profissional.
        </h1>

        <p className="mt-4 text-slate-300">
          Monte times, controle presença,
          acompanhe estatísticas e descubra
          quem realmente é o MVP.
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/register">
            <Button className="w-full">
              Começar Agora

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/login">
            <Button
              variant="ghost"
              className="
                w-full
                border
                border-slate-700
                text-white
                hover:bg-slate-800
              "
            >
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}