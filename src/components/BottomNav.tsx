"use client";

export type NavSection = "proyek" | "cari" | "profil";

interface BottomNavProps {
  active: NavSection;
  onProyek: () => void;
  onCari: () => void;
  onProfil: () => void;
}

function NavIcon({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center transition-[color,transform] duration-200 ease-out"
      style={{ color: active ? "var(--color-accent)" : "var(--color-ink-faint)", transform: active ? "scale(1.08)" : "scale(1)" }}
    >
      {children}
    </div>
  );
}

function NavLabel({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`text-[10.5px] transition-colors duration-200 ${active ? "font-semibold" : "font-medium"}`}
      style={{ color: active ? "var(--color-accent)" : "var(--color-ink-faint)" }}
    >
      {children}
    </span>
  );
}

const navButtonClass = "flex flex-col items-center gap-1 px-6 py-1 transition-transform duration-150 ease-out active:scale-90";

export function BottomNav({ active, onProyek, onCari, onProfil }: BottomNavProps) {
  return (
    <nav
      className="flex flex-none items-center justify-around border-t bg-[var(--color-card)] pt-2.5"
      style={{ borderColor: "var(--color-stone-line)", paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      aria-label="Navigasi utama"
    >
      <button onClick={onProyek} className={navButtonClass} aria-current={active === "proyek" ? "page" : undefined}>
        <NavIcon active={active === "proyek"}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavIcon>
        <NavLabel active={active === "proyek"}>Proyek</NavLabel>
      </button>
      <button onClick={onCari} className={navButtonClass} aria-current={active === "cari" ? "page" : undefined}>
        <NavIcon active={active === "cari"}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </NavIcon>
        <NavLabel active={active === "cari"}>Cari</NavLabel>
      </button>
      <button onClick={onProfil} className={navButtonClass} aria-current={active === "profil" ? "page" : undefined}>
        <NavIcon active={active === "profil"}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="2" />
            <path d="M5 20c1.3-3.6 4-5.4 7-5.4s5.7 1.8 7 5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </NavIcon>
        <NavLabel active={active === "profil"}>Profil</NavLabel>
      </button>
    </nav>
  );
}
