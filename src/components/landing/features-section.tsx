import {
  CalendarDays,
  ChartColumn,
  Shield,
  Trophy,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Peladas",
    description:
      "Controle presença, sorteio de times e histórico de participação.",
  },
  {
    icon: Shield,
    title: "Times",
    description:
      "Gerencie elencos e acompanhe desempenho da equipe.",
  },
  {
    icon: CalendarDays,
    title: "Jogos",
    description:
      "Agendamento, escalações, placares e estatísticas.",
  },
  {
    icon: Trophy,
    title: "Rankings",
    description:
      "Artilharia, assistências, MVP e melhores notas.",
  },
  {
    icon: ChartColumn,
    title: "Estatísticas",
    description:
      "Dados completos por jogador e por temporada.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">
            Muito mais que um grupo de WhatsApp
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 p-5"
              >
                <Icon className="h-8 w-8 text-green-600" />

                <h3 className="mt-4 font-bold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}