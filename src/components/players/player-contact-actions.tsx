"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildWhatsAppLinkForPhone, formatPhoneInput } from "@/lib/phone";

export function PlayerContactActions({ phone, name }: { phone: string; name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(formatPhoneInput(phone));
    setCopied(true);
    toast.success("Telefone copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button size="sm" variant="outline" className="w-auto" asChild>
        <a
          href={buildWhatsAppLinkForPhone(phone, `Fala, ${name}! Bora jogar?`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chamar ${name} no WhatsApp`}
        >
          <MessageCircle className="size-4" />
        </a>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-auto"
        onClick={handleCopy}
        aria-label={`Copiar telefone de ${name}`}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
