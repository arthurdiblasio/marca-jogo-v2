import { CalendarDays, Home, Shield, Trophy, Users } from "lucide-react";

import type { NavigationItem } from "@/types/design-system";

export const mainNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Organizacoes", icon: Home },
  { href: "/pelada", label: "Pelada", icon: Users },
  { href: "/time", label: "Time", icon: Shield },
  { href: "/pelada", label: "Agenda", icon: CalendarDays },
  { href: "/time", label: "Ranking", icon: Trophy },
];
