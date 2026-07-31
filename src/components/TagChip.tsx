interface TagChipProps {
  label: string;
  fg: string;
  bg: string;
  active?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export function TagChip({ label, fg, bg, active, interactive, onClick, size = "md" }: TagChipProps) {
  const padding = size === "sm" ? "px-2.5 py-1" : "px-3.5 py-2";
  const textSize = size === "sm" ? "text-[11px]" : "text-[12.5px]";

  const style = active
    ? { background: fg, color: "var(--color-card)", borderColor: fg }
    : { background: bg, color: fg, borderColor: "transparent" };

  const Comp = interactive ? "button" : "span";

  return (
    <Comp
      onClick={onClick}
      className={`inline-flex flex-none items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition-colors ${padding} ${textSize} ${
        interactive ? "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]" : ""
      }`}
      style={style}
    >
      <span
        className="h-1.5 w-1.5 flex-none rounded-full"
        style={{ background: active ? "var(--color-card)" : fg, opacity: active ? 0.7 : 0.55 }}
      />
      {label}
    </Comp>
  );
}
