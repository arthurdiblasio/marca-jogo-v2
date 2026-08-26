import { Logo } from "@/components/brand/logo";

export function AuthHeader() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-md px-6 py-10">
        <Logo className="h-12 w-auto" />

        <p className="mt-3 text-sm leading-6 text-muted-foreground/60">
          Organize peladas.
          <br />
          Monte seu time.
          <br />
          Acompanhe estatísticas.
        </p>
      </div>
    </section>
  );
}