export const POSITIONS_BY_MODALITY = {
  FIELD_11: ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Atacante"],
  SOCIETY_7: ["Goleiro", "Zagueiro", "Lateral", "Meia", "Atacante"],
  SOCIETY_8: ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Atacante"],
  FUTSAL_5: ["Goleiro", "Fixo", "Ala", "Pivô"],
} as const;

export type SportModality = keyof typeof POSITIONS_BY_MODALITY;

export type Position<M extends SportModality> =
  (typeof POSITIONS_BY_MODALITY)[M][number];

export const ALL_MODALITIES: { value: SportModality; label: string }[] = [
  { value: "FIELD_11", label: "Futebol de Campo (11)" },
  { value: "SOCIETY_7", label: "Society (7)" },
  { value: "SOCIETY_8", label: "Society (8)" },
  { value: "FUTSAL_5", label: "Futsal (5)" },
];

export function getPositionsForModality(modality: SportModality | null | undefined): string[] {
  if (!modality) return [];
  return [...POSITIONS_BY_MODALITY[modality]];
}
