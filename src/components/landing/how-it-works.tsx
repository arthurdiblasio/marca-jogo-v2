import {
  CalendarDays,
  Shield,
  Users,
} from "lucide-react";

export function HowItWorks() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-extrabold">
          Tudo que você precisa
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div>
            <Users className="h-10 w-10 text-green-600" />

            <h3 className="mt-4 font-bold">
              Organize Peladas
            </h3>

            <p className="mt-2 text-muted-foreground">
              Controle presença,
              sorteie times e acompanhe
              quem participou.
            </p>
          </div>

          <div>
            <Shield className="h-10 w-10 text-green-600" />

            <h3 className="mt-4 font-bold">
              Gerencie Times
            </h3>

            <p className="mt-2 text-muted-foreground">
              Monte elencos,
              acompanhe desempenho
              e histórico completo.
            </p>
          </div>

          <div>
            <CalendarDays className="h-10 w-10 text-green-600" />

            <h3 className="mt-4 font-bold">
              Marque Jogos
            </h3>

            <p className="mt-2 text-muted-foreground">
              Agende partidas entre times,
              registre placares e estatísticas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}