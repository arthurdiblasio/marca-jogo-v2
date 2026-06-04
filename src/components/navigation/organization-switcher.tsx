"use client";

import { ChevronDown, Plus, Shield, Swords } from "lucide-react";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { organizations } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

export function OrganizationSwitcher({ className }: { className?: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "flex min-w-0 items-center gap-3 rounded-md border bg-card px-3 py-2 text-left transition hover:bg-muted",
          className
        )}
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Swords className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">Pelada da Resenha</p>
          <p className="caption truncate text-muted-foreground">Organizacao atual</p>
        </div>
        <ChevronDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={10}
          className="z-50 min-w-72 rounded-lg border bg-popover p-2 text-popover-foreground shadow-modal"
        >
          {organizations.map((organization) => {
            const Icon = organization.type === "pelada" ? Swords : Shield;

            return (
              <DropdownMenu.Item
                key={organization.id}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition hover:bg-muted"
              >
                <Icon className="size-5 text-primary" />
                <span className="font-semibold">{organization.name}</span>
              </DropdownMenu.Item>
            );
          })}
          <DropdownMenu.Separator className="my-2 h-px bg-border" />
          <DropdownMenu.Item className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition hover:bg-muted">
            <Plus className="size-5 text-primary" />
            <span className="font-semibold">Criar Organizacao</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
