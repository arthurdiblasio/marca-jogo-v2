import {
  Trophy,
} from "lucide-react";

const ranking = [
  {
    name: "Arthur",
    points: 98,
  },
  {
    name: "João",
    points: 92,
  },
  {
    name: "Pedro",
    points: 89,
  },
];

export function RankingPreview() {
  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />

          <h2 className="font-bold">
            Ranking da Semana
          </h2>
        </div>

        <div className="space-y-3">
          {ranking.map(
            (player, index) => (
              <div
                key={player.name}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  p-3
                "
              >
                <span>
                  #{index + 1} {player.name}
                </span>

                <strong>
                  {player.points}
                </strong>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}