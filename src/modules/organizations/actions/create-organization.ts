"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/shared/auth/require-auth";
import { organizationRepository } from "../repositories/organization-repository";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "../schemas/create-organization-schema";
import { setActiveOrgIdCookie } from "@/shared/orgs/active-org-cookie";
import type { OrganizationType, SportModality } from "@/generated/prisma/enums";

export async function createOrganizationAction(input: CreateOrganizationInput) {
  const session = await requireAuth();

  const data = createOrganizationSchema.parse(input);

  const slug = await organizationRepository.generateUniqueSlug(data.name);

  const org = await organizationRepository.create({
    name: data.name,
    slug,
    type: data.type as OrganizationType,
    modality: data.modality as SportModality | undefined,
    logoUrl: data.logoUrl,
    address: data.address,
    city: data.city,
    state: data.state,
    lat: data.lat,
    lng: data.lng,
    description: data.description,
    weekday: data.weekday,
    scheduledTime: data.scheduledTime,
    monthlyFee: data.monthlyFee,
    singleFee: data.singleFee,
    createdById: session.id,
  });

  await setActiveOrgIdCookie(org.id);

  redirect("/dashboard");
}
