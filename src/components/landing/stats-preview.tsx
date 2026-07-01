import {
  Goal,
  Star,
  Trophy,
} from "lucide-react";

export function StatsPreview() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">
            Estatísticas reais de cada jogador
          </h2>

          <p className="mt-4 text-muted-foreground">
            Acompanhe a evolução dos jogadores,
            compare desempenhos e descubra quem
            realmente faz a diferença.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Goal className="h-5 w-5 text-green-500" />

              <span className="font-semibold text-foreground">
                Artilheiros
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-foreground">
                <span>1. Arthur</span>
                <span>12</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>2. João</span>
                <span>9</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>3. Pedro</span>
                <span>7</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />

              <span className="font-semibold text-foreground">
                Assistências
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-foreground">
                <span>1. João</span>
                <span>8</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>2. Arthur</span>
                <span>6</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>3. Lucas</span>
                <span>5</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />

              <span className="font-semibold text-foreground">
                MVPs
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-foreground">
                <span>1. Pedro</span>
                <span>4</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>2. Arthur</span>
                <span>3</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>3. João</span>
                <span>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
