const results = [
  { home: "Real Ibirite", away: "Villa Nova", score: "3-1", status: "V" },
  { home: "Santa Rita", away: "Real Ibirite", score: "2-2", status: "E" },
  { home: "Real Ibirite", away: "Uniao FC", score: "1-0", status: "V" }
];

export function ResultList() {
  return (
    <div>
      {results.map((result) => (
        <div key={`${result.home}-${result.away}`} className="sport-row grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 px-4 py-3">
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
