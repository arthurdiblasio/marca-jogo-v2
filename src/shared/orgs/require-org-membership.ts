import { prisma } from "@/lib/prisma";

export async function requireOrgMembership(userId: string, organizationId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId, organizationId, status: "ACTIVE" },
  });

  if (!membership) {
    throw new Error("Você não tem permissão para executar esta ação nesta organização.");
  }

  return membership;
}
