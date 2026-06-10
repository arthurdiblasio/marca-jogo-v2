"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/shared/auth/auth-session";
import { ONBOARDING_STEPS, ONBOARDING_TOTAL_STEPS } from "../types/onboarding";
import { onboardingRepository } from "../repositories/onboarding-repository";

export async function saveOnboardingStep(
  step: number,
  data: Record<string, unknown>,
) {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });
  if (!profile) redirect("/login");

  if (step === ONBOARDING_STEPS.MODALITY) {
    const modalities = data.modalities as string[];

    await prisma.$transaction([
      prisma.profileModality.deleteMany({
        where: { profileId: profile.id },
      }),
      ...modalities.map((modality) =>
        prisma.profileModality.create({
          data: { profileId: profile.id, modality: modality as never, positions: [] },
        }),
      ),
    ]);

    await onboardingRepository.saveStep(session.id, step, {});
  } else if (step === ONBOARDING_STEPS.POSITION) {
    const positions = data.positions as Record<string, string[]>;

    await Promise.all(
      Object.entries(positions).map(([modality, pos]) =>
        prisma.profileModality.update({
          where: { profileId_modality: { profileId: profile.id, modality: modality as never } },
          data: { positions: pos },
        }),
      ),
    );

    await onboardingRepository.saveStep(session.id, step, {});
  } else if (step === ONBOARDING_TOTAL_STEPS) {
    await onboardingRepository.completeOnboarding(session.id, data);
    redirect("/dashboard");
  } else {
    await onboardingRepository.saveStep(session.id, step, data);
  }

  redirect(`/onboarding/${step + 1}`);
}
