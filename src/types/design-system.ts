import type { LucideIcon } from "lucide-react";

export type ComponentState = "loading" | "empty" | "error" | "success";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type OrganizationType = "pelada" | "time";

export type Organization = {
  id: string;
  name: string;
  type: OrganizationType;
  members: number;
  nextEvent: string;
  accent: string;
};

export type Player = {
  name: string;
  position: string;
  number: number;
  rating: string;
};

export type RankingItem = {
  name: string;
  score: string;
  trend: "up" | "down" | "stable";
};
