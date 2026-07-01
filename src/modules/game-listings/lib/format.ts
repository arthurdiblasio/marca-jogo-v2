import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatPriceCents(priceCents: number | null | undefined): string {
  if (priceCents == null) return "Grátis";
  return (priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatListingDateTime(date: Date): string {
  return format(date, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR });
}
