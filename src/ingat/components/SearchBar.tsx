"use client";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  size?: "hero" | "compact";
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, placeholder, size = "hero", autoFocus }: SearchBarProps) {
  const isHero = size === "hero";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex w-full items-center gap-2 rounded-full border transition-shadow"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-stone-line)",
        padding: isHero ? "14px 18px" : "8px 8px 8px 16px",
        boxShadow: isHero ? "var(--shadow-card)" : "none",
      }}
    >
      <svg width={isHero ? 20 : 16} height={isHero ? 20 : 16} viewBox="0 0 24 24" fill="none" className="flex-none">
        <circle cx="11" cy="11" r="7" stroke="var(--color-ink-faint)" strokeWidth="2" />
        <path d="m20 20-3.2-3.2" stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        className="min-w-0 flex-1 border-none bg-transparent outline-none"
        style={{
          color: "var(--color-ink)",
          fontSize: isHero ? "15.5px" : "14px",
        }}
      />
      {isHero && value.trim() && (
        <button
          type="submit"
          aria-label="Cari"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[var(--color-accent-on)]"
          style={{ background: "var(--color-accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </form>
  );
}
