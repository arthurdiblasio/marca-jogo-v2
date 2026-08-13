import {
  CalendarDays,
  Goal,
  Home,
  Search,
  Shield,
  Trophy,
  Users,
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
  { href: "/time", label: "Ranking", icon: Trophy, orgTypes: ["TEAM"] },
];
