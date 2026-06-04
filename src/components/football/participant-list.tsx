import { CheckCircle2, Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const participants = [
  { name: "Bruno Costa", status: "Confirmado", time: "18:42" },
  { name: "Rafael Lima", status: "Confirmado", time: "18:39" },
  { name: "Nando Reis", status: "Confirmado", time: "18:27" },
  { name: "Caio Martins", status: "Pendente", time: "Agora" }
];

export function ParticipantList() {
  return (
    <div>
      {participants.map((participant) => (
        <div key={participant.name} className="sport-row flex items-center gap-3 px-4 py-3">
          <Avatar className="size-9 rounded-md">
            <AvatarFallback className="rounded-md text-xs">{participant.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold">{participant.name}</p>
            <p className="text-xs font-bold text-muted-foreground">{participant.time}</p>
          </div>
          {participant.status === "Confirmado" ? (
            <CheckCircle2 className="size-5 text-success" />
          ) : (
            <Clock className="size-5 text-warning" />
          )}
        </div>
      ))}
    </div>
  );
}
