interface BottomNavProps {
  onSearch: () => void;
  onProfile: () => void;
}

function NavIcon({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center"
      style={{ color: active ? "var(--color-accent)" : "var(--color-ink-faint)" }}
    >
      {children}
    </div>
  );
}

export function BottomNav({ onSearch, onProfile }: BottomNavProps) {
  return (
    <nav
      className="flex items-center justify-around border-t bg-[var(--color-card)] py-2.5"
      style={{ borderColor: "var(--color-stone-line)" }}
      aria-label="Navigasi utama"
    >
      <button className="flex flex-col items-center gap-1 px-6 py-1" aria-current="page">
        <NavIcon active>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavIcon>
        <span className="text-[10.5px] font-semibold" style={{ color: "var(--color-accent)" }}>
          Proyek
        </span>
      </button>
      <button onClick={onSearch} className="flex flex-col items-center gap-1 px-6 py-1">
        <NavIcon>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </NavIcon>
        <span className="text-[10.5px] font-medium" style={{ color: "var(--color-ink-faint)" }}>
          Cari
        </span>
      </button>
      <button onClick={onProfile} className="flex flex-col items-center gap-1 px-6 py-1">
        <NavIcon>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="2" />
            <path d="M5 20c1.3-3.6 4-5.4 7-5.4s5.7 1.8 7 5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </NavIcon>
        <span className="text-[10.5px] font-medium" style={{ color: "var(--color-ink-faint)" }}>
          Profil
        </span>
      </button>
    </nav>
  );
}
