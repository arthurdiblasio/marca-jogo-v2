import {
  BarChart3,
  CalendarDays,
  Users,
} from "lucide-react";

import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-md space-y-8">
        <FeatureCard
          icon={Users}
          title="Monte seu time"
          description="Organize jogadores e escalações."
        />

        <FeatureCard
          icon={CalendarDays}
          title="Gerencie partidas"
          description="Controle presenças e resultados."
        />

        <FeatureCard
          icon={BarChart3}
          title="Estatísticas reais"
          description="Gols, assistências, MVP e ranking."
        />
      </div>
    </section>
  );
}