import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-bold">
          Pronto para organizar suas peladas?
        </h2>

        <p className="mt-2 text-slate-600">
          Crie sua conta gratuitamente.
        </p>

        <Link href="/register">
          <Button className="mt-6">
            Criar Conta
          </Button>
        </Link>
      </div>
    </section>
  );
}