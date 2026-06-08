import { redirect } from "next/navigation";

import { getSession } from "./auth-session";

export async function requireGuest() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }
}
