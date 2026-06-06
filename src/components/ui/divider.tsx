interface DividerProps {
  text?: string;
}

export function Divider({
  text = "ou",
}: DividerProps) {
  return (
    <div className="flex items-center">
      <div className="h-px flex-1 bg-slate-200" />

      <span className="px-4 text-sm text-slate-500">
        {text}
      </span>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}