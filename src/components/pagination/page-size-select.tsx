"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function PageSizeSelect({ pageSize, options }: { pageSize: number; options: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      Por página
      <select
        value={pageSize}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border-2 border-border bg-card px-2 py-1.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
