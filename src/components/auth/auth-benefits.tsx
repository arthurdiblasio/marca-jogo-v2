import {
  CheckCircle2,
} from "lucide-react";

const benefits = [
  "Organize peladas",
  "Monte seu time",
  "Acompanhe estatísticas",
];

export function AuthBenefits() {
  return (
    <div className="space-y-3">
      {benefits.map((benefit) => (
        <div
          key={benefit}
          className="flex items-center gap-3"
        >
          <CheckCircle2 className="h-4 w-4 text-green-500" />

          <span className="text-sm text-slate-300">
            {benefit}
          </span>
        </div>
      ))}
    </div>
  );
}