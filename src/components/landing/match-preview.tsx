import {
  Clock3,
} from "lucide-react";

export function MatchPreview() {
  return (
    <section className="px-6 py-4">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-5 text-foreground">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />

          Próxima Pelada
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Sábado • 09:00
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span>Time Azul</span>

            <span className="text-xl font-bold">
              VS
            </span>

            <span>Time Preto</span>
          </div>
        </div>
      </div>
    </section>
  );
}
