import Link from "next/link";
import { Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/shared/auth/auth-session";
import { playerInviteRepository } from "@/modules/player-invites/repositories/player-invite-repository";
import { AcceptInviteButton } from "@/components/players/accept-invite-button";

export default async function PlayerInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await playerInviteRepository.findByToken(token);
  const session = await getSession();

  return (
    <div className="grid min-h-screen place-items-center bg-muted px-4">
      <Card className="w-full max-w-sm space-y-4 p-6 text-center">
        <Avatar className="mx-auto size-14 rounded-2xl bg-primary/10">
          {invite?.organization.logoUrl && (
            <AvatarImage src={invite.organization.logoUrl} alt={invite.organization.name} />
          )}
          <AvatarFallback className="rounded-2xl bg-transparent">
            <Shield className="size-7 text-primary" />
          </AvatarFallback>
        </Avatar>

        {!invite ? (
          <>
            <h1 className="text-lg font-black text-foreground">Convite inválido</h1>
            <p className="text-sm text-muted-foreground">Este link de convite não existe ou foi removido.</p>
          </>
        ) : invite.status === "ACCEPTED" ? (
          <>
            <h1 className="text-lg font-black text-foreground">Convite já utilizado</h1>
            <p className="text-sm text-muted-foreground">Este convite já foi aceito por alguém. Peça um novo link.</p>
          </>
        ) : invite.status === "CANCELLED" || invite.status === "EXPIRED" || invite.expiresAt < new Date() ? (
          <>
            <h1 className="text-lg font-black text-foreground">Convite expirado</h1>
            <p className="text-sm text-muted-foreground">Este link não é mais válido. Peça um novo convite ao time.</p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-black text-foreground">{invite.organization.name} te convidou!</h1>
            <p className="text-sm text-muted-foreground">Entre para o time e comece a jogar.</p>

            {session ? (
              <AcceptInviteButton token={token} />
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href={`/register?invite=${token}`}>Criar conta</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/login?invite=${token}`}>Já tenho conta</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
