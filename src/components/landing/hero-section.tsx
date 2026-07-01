import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Shield,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-green-600/30 bg-green-600/10 px-3 py-1 text-sm font-medium text-primary">
              Futebol amador organizado
            </div>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-foreground">
              Organize peladas.
              <br />
              Gerencie times.
              <br />
              Marque jogos.
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              Tudo em um único lugar para o futebol amador.
              Controle presença, sorteie times,
              acompanhe estatísticas e descubra quem é o MVP.
            </p>

            <div className="mt-8 flex gap-3">
              <Link href="/register">
                <Button>
                  Começar Agora

                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/login">
                <Button variant="secondary">
                  Entrar
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Peladas
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Times
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-green-500" />
                Jogos
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-500" />
                Rankings
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Próximo Jogo
                </span>

                <span className="text-green-500">
                  Confirmado
                </span>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Domingo • 09:00
                </p>

                <div className="mt-4 flex items-center justify-between text-foreground">
                  <span>Real Ibirité</span>

                  <span className="text-2xl font-bold">
                    VS
                  </span>

                  <span>Ajax FC</span>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-muted p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  Destaques da Temporada
                </p>

                <div className="space-y-3 text-foreground">
                  <div className="flex justify-between">
                    <span>⚽ Arthur</span>
                    <span>12 gols</span>
                  </div>

                  <div className="flex justify-between">
                    <span>🎯 João</span>
                    <span>8 assistências</span>
                  </div>

                  <div className="flex justify-between">
                    <span>⭐ Pedro</span>
                    <span>4 MVPs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
