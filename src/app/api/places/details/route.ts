import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/shared/auth/auth-session";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleDetailsResponse {
  status: string;
  result: {
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
    address_components: AddressComponent[];
  };
}

function findComponent(components: AddressComponent[], type: string) {
  return components.find((c) => c.types.includes(type));
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const placeId = request.nextUrl.searchParams.get("placeId")?.trim();
  if (!placeId) {
    return NextResponse.json({ error: "placeId é obrigatório" }, { status: 400 });
  }

  const url = new URL(
    process.env.GOOGLE_PLACES_API_URL ?? "https://maps.googleapis.com/maps/api/place/details/json",
  );
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "formatted_address,geometry,address_component");
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("key", process.env.GOOGLE_PLACES_API_KEY ?? "");

  const res = await fetch(url);
  const data: GoogleDetailsResponse = await res.json();

  if (data.status !== "OK") {
    return NextResponse.json({ error: "Erro ao buscar endereço" }, { status: 502 });
  }

  const { formatted_address, geometry, address_components } = data.result;
  const state = findComponent(address_components, "administrative_area_level_1")?.short_name;
  const city =
    findComponent(address_components, "administrative_area_level_2")?.long_name ??
    findComponent(address_components, "locality")?.long_name;

  return NextResponse.json({
    address: formatted_address,
    lat: geometry.location.lat,
    lng: geometry.location.lng,
    city: city ?? null,
    state: state ?? null,
  });
}
