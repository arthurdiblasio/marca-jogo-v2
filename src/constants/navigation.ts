import {
  CalendarDays,
  Goal,
  Home,
  Megaphone,
  Search,
  Shield,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

import type { NavigationItem } from "@/types/design-system";

export const mainNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/pelada", label: "Pelada", icon: Users, orgTypes: ["PELADA"] },
  { href: "/time", label: "Time", icon: Shield, orgTypes: ["TEAM"] },
  {
    href: "/time/agenda",
    label: "Minha Agenda",
    icon: Goal,
    orgTypes: ["TEAM"],
  },
  { href: "/jogos", label: "Buscar Jogos", icon: Search, orgTypes: ["TEAM"] },
  {
    href: "/pelada",
    label: "Agenda",
    icon: CalendarDays,
    orgTypes: ["PELADA"],
  },
  { href: "/time/ranking", label: "Ranking", icon: Trophy, orgTypes: ["TEAM"] },
  { href: "/pelada/ranking", label: "Ranking", icon: Trophy, orgTypes: ["PELADA"] },
  { href: "/time/financeiro", label: "Financeiro", icon: Wallet, orgTypes: ["TEAM"] },
  { href: "/pelada/financeiro", label: "Financeiro", icon: Wallet, orgTypes: ["PELADA"] },
  { href: "/convocacoes", label: "Convocações", icon: Megaphone },
];
