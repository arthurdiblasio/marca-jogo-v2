import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthHeader />

      <section className="mx-auto max-w-md px-6 py-8">
        <LoginForm inviteToken={invite} />
      </section>
    </div>
  );
}