"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Link2, User, UserPlus, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createGuestPlayerAction } from "@/modules/guest-players/actions/create-guest-player";
import { mergeGuestPlayerAction } from "@/modules/guest-players/actions/merge-guest-player";

type GuestPlayer = { id: string; name: string };
type MemberOption = { userId: string; name: string; imageUrl: string | null; hasMergedGuest: boolean };

function MergeGuestControl({ guest, members }: { guest: GuestPlayer; members: MemberOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pendingMember, setPendingMember] = useState<MemberOption | null>(null);

  const eligibleMembers = useMemo(() => members.filter((m) => !m.hasMergedGuest), [members]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = query.trim().toLowerCase();
    return eligibleMembers.filter((m) => m.name.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query, eligibleMembers]);

  async function handleConfirmMerge() {
    if (!pendingMember) return;
    try {
      await mergeGuestPlayerAction({ guestPlayerId: guest.id, userId: pendingMember.userId });
      toast.success(`${guest.name} vinculado a ${pendingMember.name}!`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao vincular jogador");
      throw error;
    }
  }

  return (
    <>
      {!open ? (
        <Button size="sm" variant="outline" className="w-auto" onClick={() => setOpen(true)}>
          <Link2 className="size-3.5" />
          Vincular
        </Button>
      ) : (
        <div className="relative">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Buscar jogador..."
            className="h-9 w-48 py-2 text-sm"
          />
          {results.length > 0 && (
            <Card className="absolute right-0 z-10 mt-1.5 w-56 overflow-hidden p-1.5">
              {results.map((member) => (
                <button
                  key={member.userId}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setPendingMember(member)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  <Avatar className="size-6 rounded-lg bg-primary/10">
                    {member.imageUrl && <AvatarImage src={member.imageUrl} alt={member.name} />}
                    <AvatarFallback className="rounded-lg bg-transparent text-xs">
                      <User className="size-3 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate">{member.name}</span>
                </button>
              ))}
            </Card>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingMember}
        onOpenChange={(next) => !next && setPendingMember(null)}
        variant="destructive"
        title={`Vincular "${guest.name}" a ${pendingMember?.name ?? ""}?`}
        description={`Todas as estatísticas de "${guest.name}" nesta organização serão transferidas para ${pendingMember?.name}, e o convidado será removido. Essa ação não pode ser desfeita.`}
        confirmLabel="Vincular"
        onConfirm={handleConfirmMerge}
      />
    </>
  );
}

export function GuestPlayersSection({
  organizationId,
  guests,
  members,
  isManager,
}: {
  organizationId: string;
  guests: GuestPlayer[];
  members: MemberOption[];
  isManager: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createGuestPlayerAction({ organizationId, name });
        toast.success("Jogador convidado adicionado!");
        setName("");
        setAdding(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao adicionar jogador convidado");
      }
    });
  }

  if (!isManager && guests.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-foreground">Jogadores convidados</h2>
          <p className="text-sm text-muted-foreground">
            Sem conta na plataforma, mas já entram nas estatísticas. Quando a pessoa se cadastrar, vincule o convidado a ela.
          </p>
        </div>
      </div>

      {isManager &&
        (adding ? (
          <Card className="p-4">
            <form onSubmit={handleAdd} className="flex items-center gap-2">
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do jogador"
                minLength={2}
                required
                className="h-10 py-2"
              />
              <Button type="submit" size="sm" className="w-auto" disabled={isPending}>
                Adicionar
              </Button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </form>
          </Card>
        ) : (
          <Button size="sm" variant="outline" className="w-auto" onClick={() => setAdding(true)}>
            <UserPlus className="size-4" />
            Adicionar jogador convidado
          </Button>
        ))}

      {guests.length > 0 && (
        <div className="space-y-2">
          {guests.map((guest) => (
            <Card key={guest.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 rounded-xl bg-amber-500/10">
                  <AvatarFallback className="rounded-xl bg-transparent">
                    <UserPlus className="size-4 text-amber-500" />
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-foreground">{guest.name}</p>
              </div>
              {isManager && <MergeGuestControl guest={guest} members={members} />}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
