import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/shared/auth/require-auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}