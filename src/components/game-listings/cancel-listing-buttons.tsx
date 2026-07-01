"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cancelGameListingAction } from "@/modules/game-listings/actions/cancel-game-listing";
import { cancelGameListingSeriesAction } from "@/modules/game-listings/actions/cancel-game-listing-series";

export function CancelListingButtons({
  gameListingId,
  seriesId,
}: {
  gameListingId: string;
  seriesId: string | null;
}) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState<"listing" | "series" | null>(null);

  async function handleCancel(scope: "listing" | "series") {
    setIsCancelling(scope);
    try {
      if (scope === "listing") {
        await cancelGameListingAction(gameListingId);
      } else if (seriesId) {
        await cancelGameListingSeriesAction(seriesId);
      }
      toast.success(scope === "listing" ? "Jogo cancelado" : "Série cancelada");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar");
    } finally {
      setIsCancelling(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-auto"
        disabled={isCancelling !== null}
        onClick={() => handleCancel("listing")}
      >
        {isCancelling === "listing" ? "Cancelando..." : "Cancelar este jogo"}
      </Button>
      {seriesId && (
        <Button
          variant="outline"
          size="sm"
          className="w-auto"
          disabled={isCancelling !== null}
          onClick={() => handleCancel("series")}
        >
          {isCancelling === "series" ? "Cancelando..." : "Cancelar toda a série"}
        </Button>
      )}
    </div>
  );
}
