export const ONBOARDING_TOTAL_STEPS = 8;

export const ONBOARDING_STEPS = {
  NAME: 1,
  LOCATION: 2,
  BIRTHDATE: 3,
  MODALITY: 4,
  POSITION: 5,
  FOOT: 6,
  SHIRT: 7,
  BIO: 8,
} as const;

export type OnboardingStepNumber = (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

export type StepNameData = {
  fullName: string;
  nickname?: string;
};

export type StepLocationData = {
  city: string;
  state: string;
};

export type StepBirthdateData = {
  birthDate: string;
};

export type StepModalityData = {
  modalities: string[];
};

export type StepPositionData = {
  positions: Record<string, string[]>;
};

export type StepFootData = {
  preferredFoot: "LEFT" | "RIGHT" | "BOTH";
};

export type StepShirtData = {
  shirtNumber: number;
};

export type StepBioData = {
  bio?: string;
};

export type OnboardingStepData =
  | StepNameData
  | StepLocationData
  | StepBirthdateData
  | StepModalityData
  | StepPositionData
  | StepFootData
  | StepShirtData
  | StepBioData;
