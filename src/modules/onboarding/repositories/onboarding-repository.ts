import { prisma } from "@/lib/prisma";

export const onboardingRepository = {
  findProfileByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        fullName: true,
        onboardingStep: true,
        onboardingCompletedAt: true,
        modalityPositions: {
          select: { modality: true, positions: true },
        },
      },
    });
  },

  saveStep(userId: string, step: number, data: Record<string, unknown>) {
    return prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        onboardingStep: step,
      },
    });
  },

  completeOnboarding(userId: string, step: number, data: Record<string, unknown>) {
    return prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        onboardingStep: step,
        onboardingCompletedAt: new Date(),
      },
    });
  },
};
