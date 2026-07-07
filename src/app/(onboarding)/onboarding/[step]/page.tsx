import { notFound, redirect } from "next/navigation";

import { getSession } from "@/shared/auth/auth-session";
import { onboardingRepository } from "@/modules/onboarding/repositories/onboarding-repository";
import { ONBOARDING_TOTAL_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepName } from "@/components/onboarding/steps/step-name";
import { StepLocation } from "@/components/onboarding/steps/step-location";
import { StepBirthdate } from "@/components/onboarding/steps/step-birthdate";
import { StepModality } from "@/components/onboarding/steps/step-modality";
import { StepPosition } from "@/components/onboarding/steps/step-position";
import { StepFoot } from "@/components/onboarding/steps/step-foot";
import { StepShirt } from "@/components/onboarding/steps/step-shirt";
import { StepBio } from "@/components/onboarding/steps/step-bio";
import { StepPhone } from "@/components/onboarding/steps/step-phone";

interface Props {
  params: Promise<{ step: string }>;
}

export default async function OnboardingStepPage({ params }: Props) {
  const { step: stepParam } = await params;
  const stepNumber = parseInt(stepParam, 10);

  if (
    isNaN(stepNumber) ||
    stepNumber < 1 ||
    stepNumber > ONBOARDING_TOTAL_STEPS
  ) {
    notFound();
  }

  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await onboardingRepository.findProfileByUserId(session.id);
  if (!profile) redirect("/login");

  if (profile.onboardingCompletedAt) redirect("/dashboard");

  const savedStep = profile.onboardingStep;
  if (stepNumber > savedStep + 1) {
    redirect(`/onboarding/${savedStep + 1}`);
  }

  const stepComponents: Record<number, React.ReactNode> = {
    1: <StepName />,
    2: <StepLocation />,
    3: <StepBirthdate />,
    4: <StepModality />,
    5: <StepPosition selectedModalities={(profile.modalityPositions ?? []).map((m) => m.modality as import("@/constants/positions").SportModality)} />,
    6: <StepFoot />,
    7: <StepShirt />,
    8: <StepBio />,
    9: <StepPhone />,
  };

  return (
    <OnboardingShell currentStep={stepNumber} totalSteps={ONBOARDING_TOTAL_STEPS}>
      {stepComponents[stepNumber]}
    </OnboardingShell>
  );
}
