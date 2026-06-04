type StatStripProps = {
  items: Array<{ label: string; value: string; helper?: string }>;
};

export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="border-b border-r p-4 last:border-r-0 md:border-b-0">
          <p className="text-3xl font-black leading-none">{item.value}</p>
          <p className="mt-2 text-xs font-black uppercase text-muted-foreground">{item.label}</p>
          {item.helper ? <p className="mt-1 text-xs font-bold text-primary">{item.helper}</p> : null}
        </div>
      ))}
    </div>
  );
}
