import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AvatarGroup({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0, 4).map((name) => (
        <Avatar key={name} className="border-2 border-card">
          <AvatarFallback className="text-xs">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
