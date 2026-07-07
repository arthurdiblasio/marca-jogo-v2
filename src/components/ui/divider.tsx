interface DividerProps {
  text?: string;
}

export function Divider({
  text = "ou",
}: DividerProps) {
  return (
    <div className="flex items-center">
      <div className="h-px flex-1 bg-muted" />

      <span className="px-4 text-sm text-muted-foreground">
        {text}
      </span>

      <div className="h-px flex-1 bg-muted" />
    </div>
  );
}