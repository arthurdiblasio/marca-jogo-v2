import { OrganizationLeagueList } from "@/components/football/organization-league-list";
import { SportSection } from "@/components/football/sport-section";
import { StatStrip } from "@/components/football/stat-strip";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { organizations } from "@/constants/mock-data";

export default function OrganizationsPage() {
  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Escolha onde jogar"
        title="Suas organizacoes"
        description="Acesse rapidamente suas peladas e times, com proximo evento e atividade em destaque."
      />

      <SportSection title="Resumo">
        <StatStrip
          items={[
            { label: "Organizacoes", value: "4", helper: "2 peladas" },
            { label: "Jogos", value: "12", helper: "no mes" },
            { label: "Presenca", value: "86%", helper: "media" },
            { label: "Ranking", value: "#3", helper: "geral" }
          ]}
        />
      </SportSection>

      <OrganizationLeagueList organizations={organizations} />
    </PageTransition>
  );
}
