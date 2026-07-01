const IBGE_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export async function fetchStates(): Promise<{ value: string; label: string }[]> {
  const res = await fetch(`${IBGE_BASE}/estados?orderBy=nome`);
  const data: { sigla: string; nome: string }[] = await res.json();
  return data.map((s) => ({ value: s.sigla, label: s.nome }));
}

export async function fetchCitiesByState(uf: string): Promise<string[]> {
  const res = await fetch(`${IBGE_BASE}/estados/${uf}/municipios?orderBy=nome`);
  const data: { nome: string }[] = await res.json();
  return data.map((c) => c.nome);
}
