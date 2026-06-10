"use server";

import { setActiveOrgIdCookie } from "@/shared/orgs/active-org-cookie";

export async function setActiveOrgAction(orgId: string) {
  await setActiveOrgIdCookie(orgId);
}
