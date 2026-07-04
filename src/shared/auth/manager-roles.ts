import type { MembershipRole } from "@/generated/prisma/enums";

export const MANAGER_ROLES: MembershipRole[] = ["OWNER", "ADMIN", "CAPTAIN"];

export function isManagerRole(role: MembershipRole | undefined | null) {
  return !!role && MANAGER_ROLES.includes(role);
}
