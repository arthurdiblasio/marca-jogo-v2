export function AuthStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-2xl font-bold text-white">
          1200+
        </p>

        <p className="text-xs text-muted-foreground">
          Jogadores
        </p>
      </div>

      <div>
        <p className="text-2xl font-bold text-white">
          350+
        </p>

        <p className="text-xs text-muted-foreground">
          Partidas
        </p>
      </div>

      <div>
        <p className="text-2xl font-bold text-white">
          80+
        </p>

        <p className="text-xs text-muted-foreground">
          Times
        </p>
      </div>
    </div>
  );
}