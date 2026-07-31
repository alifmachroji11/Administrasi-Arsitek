"use client";

import { SearchBar } from "../components/SearchBar";

interface IngatHomeProps {
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  recentSearches: string[];
  onRecentClick: (q: string) => void;
  projectFilter: string | null;
  onToggleProjectFilter: (p: string) => void;
  projectChips: string[];
}

export function IngatHome({
  query,
  onQueryChange,
  onSubmit,
  placeholder,
  recentSearches,
  onRecentClick,
  projectFilter,
  onToggleProjectFilter,
  projectChips,
}: IngatHomeProps) {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-6 pt-10 pb-8">
      <div className="mb-1.5 flex-1" />

      <h1 className="font-display mb-7 text-center text-[26px] font-semibold" style={{ color: "var(--color-ink)" }}>
        Tanya apa saja tentang proyekmu
      </h1>

      <SearchBar value={query} onChange={onQueryChange} onSubmit={onSubmit} placeholder={placeholder} size="hero" autoFocus />

      {projectFilter && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => onToggleProjectFilter(projectFilter)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
            style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-soft-ink)" }}
          >
            Mencari khusus di: {projectFilter}
            <span aria-hidden>✕</span>
          </button>
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-[11.5px] font-semibold uppercase" style={{ color: "var(--color-ink-faint)", letterSpacing: "0.06em" }}>
            Pencarian Terakhir
          </p>
          <div className="flex flex-col gap-2">
            {recentSearches.map((q) => (
              <button
                key={q}
                onClick={() => onRecentClick(q)}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-[13.5px] transition-colors"
                style={{ color: "var(--color-ink)", background: "var(--color-card)", border: "1px solid var(--color-stone-line)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-none">
                  <circle cx="12" cy="12" r="8" stroke="var(--color-ink-faint)" strokeWidth="1.8" />
                  <path d="M12 8v4l3 2" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {projectChips.length > 0 && (
      <div className="mt-8">
        <p className="mb-3 text-[11.5px] font-semibold uppercase" style={{ color: "var(--color-ink-faint)", letterSpacing: "0.06em" }}>
          Proyek yang Terhubung
        </p>
        <div className="flex flex-wrap gap-2">
          {projectChips.map((p) => {
            const active = projectFilter === p;
            return (
              <button
                key={p}
                onClick={() => onToggleProjectFilter(p)}
                className="rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors"
                style={
                  active
                    ? { background: "var(--color-ink)", color: "var(--color-card)", borderColor: "var(--color-ink)" }
                    : { background: "var(--color-card)", color: "var(--color-ink-soft)", borderColor: "var(--color-stone-line)" }
                }
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
      )}

      <div className="flex-[2]" />
    </div>
  );
}
