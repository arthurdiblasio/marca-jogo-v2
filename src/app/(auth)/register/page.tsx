import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;

  return (
    <div className="min-h-screen bg-muted">
      <AuthHeader />

      <section className="mx-auto max-w-md px-6 py-8">
        <RegisterForm inviteToken={invite} />
      </section>
    </div>
  );
}