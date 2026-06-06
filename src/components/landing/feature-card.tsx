import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
        <Icon className="h-5 w-5 text-green-700" />
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="text-sm text-slate-600">
        {description}
      </p>
    </div>
  );
}