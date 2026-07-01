"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { expressInterestAction } from "@/modules/game-listings/actions/express-interest";

export function ExpressInterestButton({
  gameListingId,
  disabled,
  disabledLabel,
}: {
  gameListingId: string;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (disabled) {
    return (
      <Button disabled className="w-auto">
        {disabledLabel ?? "Tenho interesse"}
      </Button>
    );
  }

  async function handleClick() {
    setIsSubmitting(true);
    try {
      await expressInterestAction({ gameListingId });
      toast.success("Interesse enviado! O time anunciante vai analisar.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao demonstrar interesse");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button className="w-auto" disabled={isSubmitting} onClick={handleClick}>
      {isSubmitting ? "Enviando..." : "Tenho interesse"}
    </Button>
  );
}
