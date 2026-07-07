export type MatchResultRow = {
  id: string;
  home: string;
  away: string;
  score: string;
  status: "V" | "E" | "D";
};

export function ResultList({ results }: { results: MatchResultRow[] }) {
  if (results.length === 0) {
    return <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado ainda.</p>;
  }

  return (
    <div>
      {results.map((result) => (
        <div key={result.id} className="sport-row grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 px-4 py-3">
          <p className="truncate text-right text-sm font-extrabold">{result.home}</p>
          <span className="rounded bg-muted px-3 py-1 text-lg font-black">{result.score}</span>
          <p className="truncate text-sm font-extrabold">{result.away}</p>
          <span className="grid size-7 place-items-center rounded bg-primary text-xs font-black text-primary-foreground">
            {result.status}
          </span>
        </div>
      ))}
    </div>
  );
}
