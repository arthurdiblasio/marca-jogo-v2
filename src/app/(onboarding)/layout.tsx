import { requireAuth } from "@/shared/auth/require-auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {children}
    </div>
  );
}
