const BARS = [6, 13, 9, 15, 7, 11];

export function VoiceMark() {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="flex h-4 items-end gap-[2.5px]">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{ height: `${h}px`, background: "var(--color-accent)" }}
          />
        ))}
      </span>
      <span className="text-[11.5px] font-semibold" style={{ color: "var(--color-accent)" }}>
        Diucapkan
      </span>
    </div>
  );
}
