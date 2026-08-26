"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Megaphone } from "lucide-react";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setActiveOrgAction } from "@/modules/organizations/actions/set-active-org";
import { cn } from "@/lib/utils";

export type CallUpNotification = {
  id: string;
  kind: "pelada" | "match";
  organizationId: string;
  organizationName: string;
  title: string;
  subtitle: string;
  href: string;
};

export function NotificationsBell({
  notifications,
  activeOrgId,
}: {
  notifications: CallUpNotification[];
  activeOrgId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function openNotification(notification: CallUpNotification) {
    startTransition(async () => {
      if (notification.organizationId !== activeOrgId) {
        await setActiveOrgAction(notification.organizationId);
      }
      router.push(notification.href);
      router.refresh();
    });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="icon" variant="ghost" aria-label="Notificações" className="relative" disabled={isPending}>
          <Bell className="size-5" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-black leading-4 text-white">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 max-h-96 w-80 overflow-y-auto rounded-lg border bg-popover p-2 text-popover-foreground shadow-modal"
        >
          {notifications.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">Nenhuma notificação pendente.</p>
          ) : (
            notifications.map((notification) => (
              <DropdownMenu.Item
                key={`${notification.kind}:${notification.id}`}
                onSelect={() => openNotification(notification)}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-md px-3 py-2.5 text-sm outline-none transition hover:bg-muted",
                )}
              >
                <Megaphone className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{notification.title}</p>
                  <p className="caption capitalize text-muted-foreground">{notification.subtitle}</p>
                  <p className="caption text-primary">{notification.organizationName}</p>
                </div>
              </DropdownMenu.Item>
            ))
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
