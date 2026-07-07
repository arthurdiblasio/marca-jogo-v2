import { Trophy } from "lucide-react";

export function AuthHeader() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-md px-6 py-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-600">
          <Trophy className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          Chama Time
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-300">
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