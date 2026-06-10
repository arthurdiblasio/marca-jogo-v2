import Link from "next/link";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyOrgsState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 grid size-20 place-items-center rounded-2xl bg-primary/10">
        <Swords className="size-10 text-primary" />
      </div>

      <h1 className="text-2xl font-black text-slate-900">
        Pronto para jogar?
      </h1>
      <p className="mt-2 max-w-sm text-slate-500">
        Crie sua primeira organização para registrar peladas, acompanhar estatísticas e muito mais.
      </p>

      <div className="mt-8 w-full max-w-xs">
        <Button asChild>
          <Link href="/organizations/new">Criar organização</Link>
        </Button>
      </div>
    </div>
  );
}
