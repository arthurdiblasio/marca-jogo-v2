"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { callUpRepository } from "../repositories/call-up-repository";
import { respondCallUpSchema, type RespondCallUpInput } from "../schemas/call-up-schemas";

export async function respondCallUpAction(input: RespondCallUpInput) {
  const session = await requireAuth();
  const data = respondCallUpSchema.parse(input);

  if (data.kind === "pelada") {
    const callUp = await callUpRepository.findPeladaCallUpById(data.id);
    if (!callUp || callUp.userId !== session.id) {
      throw new Error("Convocação não encontrada.");
    }
    await callUpRepository.respondPeladaCallUp(data.id, data.status);
  } else {
    const callUp = await callUpRepository.findMatchCallUpById(data.id);
    if (!callUp || callUp.userId !== session.id) {
      throw new Error("Convocação não encontrada.");
    }
    await callUpRepository.respondMatchCallUp(data.id, data.status);
  }

  revalidatePath("/convocacoes");
}
