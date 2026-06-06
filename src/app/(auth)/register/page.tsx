import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AuthHeader />

      <section className="mx-auto max-w-md px-6 py-8">
        <RegisterForm />
      </section>
    </div>
  );
}