import type { Organization, Player, RankingItem } from "@/types/design-system";

export const organizations: Organization[] = [
  {
    id: "pelada-resenha",
    name: "Pelada da Resenha",
    type: "pelada",
    members: 28,
    nextEvent: "Hoje, 20:30",
    accent: "from-emerald-500 to-lime-400"
  },
  {
    id: "quinta-amigos",
    name: "Quinta dos Amigos",
    type: "pelada",
    members: 21,
    nextEvent: "Quinta, 21:00",
    accent: "from-yellow-400 to-emerald-500"
  },
  {
    id: "real-ibirite",
    name: "Real Ibirite",
    type: "time",
    members: 18,
    nextEvent: "Domingo, 09:00",
    accent: "from-slate-900 to-emerald-500"
  },
  {
    id: "atletico-master",
    name: "Atletico Master",
    type: "time",
    members: 23,
    nextEvent: "Sabado, 16:00",
    accent: "from-red-500 to-slate-900"
  }
];

export const peladaStats = [
  { label: "Presencas", value: "24", helper: "+18% vs. semana passada" },
  { label: "Gols", value: "68", helper: "Media de 5.6 por jogo" },
  { label: "Assiduidade", value: "86%", helper: "Grupo em alta" }
];

export const teamStats = [
  { label: "Aproveitamento", value: "78%", helper: "Temporada atual" },
  { label: "Gols Pro", value: "31", helper: "2.8 por jogo" },
  { label: "Gols Contra", value: "12", helper: "Defesa solida" },
  { label: "Sequencia", value: "4", helper: "Jogos sem perder" }
];

export const peladaRanking: RankingItem[] = [
  { name: "Bruno Costa", score: "9.4", trend: "up" },
  { name: "Rafael Lima", score: "8.9", trend: "stable" },
  { name: "Mateus Rocha", score: "8.7", trend: "up" },
  { name: "Diego Alves", score: "8.3", trend: "down" }
];

export const teamPlayers: Player[] = [
  { name: "Caio Martins", position: "GOL", number: 1, rating: "8.1" },
  { name: "Leo Barbosa", position: "ZAG", number: 4, rating: "7.9" },
  { name: "Nando Reis", position: "MEI", number: 10, rating: "8.6" },
  { name: "Victor Hugo", position: "ATA", number: 9, rating: "8.4" }
];
