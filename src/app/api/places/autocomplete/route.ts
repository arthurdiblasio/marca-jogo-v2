import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/shared/auth/auth-session";

interface GooglePrediction {
  place_id: string;
  description: string;
}

interface GoogleAutocompleteResponse {
  status: string;
  predictions: GooglePrediction[];
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const input = request.nextUrl.searchParams.get("input")?.trim();
  if (!input || input.length < 3) {
    return NextResponse.json({ predictions: [] });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("components", "country:br");
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("key", process.env.GOOGLE_PLACES_API_KEY ?? "");

  const res = await fetch(url);
  const data: GoogleAutocompleteResponse = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return NextResponse.json({ error: "Erro ao buscar endereços" }, { status: 502 });
  }

  return NextResponse.json({
    predictions: data.predictions.map((p) => ({
      placeId: p.place_id,
      description: p.description,
    })),
  });
}
