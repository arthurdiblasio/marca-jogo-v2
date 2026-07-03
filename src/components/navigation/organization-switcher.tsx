"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Shield, Swords } from "lucide-react";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrgs } from "@/contexts/org-context";
import { setActiveOrgAction } from "@/modules/organizations/actions/set-active-org";
import { cn } from "@/lib/utils";

export function OrganizationSwitcher({ className }: { className?: string }) {
  const { orgs, activeOrg } = useOrgs();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchOrg(orgId: string) {
    startTransition(async () => {
      await setActiveOrgAction(orgId);
      router.push("/dashboard");
      router.refresh();
    });
  }

  const ActiveIcon = activeOrg?.type === "TEAM" ? Shield : Swords;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "flex min-w-0 items-center gap-3 rounded-md border bg-card px-3 py-2 text-left transition hover:bg-muted",
          isPending && "opacity-60",
          className,
        )}
      >
        <Avatar className="size-9 rounded-md bg-primary/10 text-primary">
          {activeOrg?.logoUrl && <AvatarImage src={activeOrg.logoUrl} alt={activeOrg.name} />}
          <AvatarFallback className="rounded-md bg-transparent">
            <ActiveIcon className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">
            {activeOrg?.name ?? "Nenhuma organização"}
          </p>
          <p className="caption truncate text-muted-foreground">
            Organização atual
          </p>
        </div>
        <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={10}
          className="z-50 min-w-72 rounded-lg border bg-popover p-2 text-popover-foreground shadow-modal"
        >
          {orgs.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Nenhuma organização ainda.
            </p>
          ) : (
            orgs.map((org) => {
              const OrgIcon = org.type === "TEAM" ? Shield : Swords;
              const isActive = org.id === activeOrg?.id;

              return (
                <DropdownMenu.Item
                  key={org.id}
                  onSelect={() => !isActive && switchOrg(org.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition hover:bg-muted",
                    isActive && "bg-muted",
                  )}
                >
                  <Avatar className="size-8 rounded-md bg-primary/10 text-primary">
                    {org.logoUrl && <AvatarImage src={org.logoUrl} alt={org.name} />}
                    <AvatarFallback className="rounded-md bg-transparent">
                      <OrgIcon className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{org.name}</span>
                  {isActive && (
                    <span className="ml-auto text-xs font-semibold text-primary">
                      Ativa
                    </span>
                  )}
                </DropdownMenu.Item>
              );
            })
          )}

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <DropdownMenu.Item asChild>
            <Link
              href="/organizations/new"
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition hover:bg-muted"
            >
              <Plus className="size-5 text-primary" />
              <span className="font-semibold">Criar organização</span>
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
