import { useEffect, useMemo, useRef, useState } from "react";
import type { IngatScreen } from "./lib/types";
import { runSearch } from "./lib/search";
import { sourceById } from "./data/sources";
import { EXAMPLE_QUERIES, RECENT_SEARCHES } from "./data/searchIndex";
import { SearchBar } from "./components/SearchBar";
import { IngatHome } from "./screens/IngatHome";
import { IngatResults } from "./screens/IngatResults";
import { IngatSourceDetail } from "./screens/IngatSourceDetail";
import { IngatSettings } from "./screens/IngatSettings";

export function IngatShell() {
  const [screen, setScreen] = useState<IngatScreen>("home");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(RECENT_SEARCHES);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIndex((i) => (i + 1) % EXAMPLE_QUERIES.length), 3200);
    return () => clearInterval(timer);
  }, []);

  const result = useMemo(() => runSearch(submittedQuery, projectFilter), [submittedQuery, projectFilter]);
  const selectedSource = selectedSourceId ? sourceById(selectedSourceId) : undefined;

  const runQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setQuery(trimmed);
    setRecentSearches((prev) => [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 4));
    setScreen("results");
  };

  const goHome = () => {
    setScreen("home");
    setQuery("");
  };

  const openSource = (id: string) => {
    setSelectedSourceId(id);
    setScreen("detail");
  };

  const toggleProjectFilter = (p: string) => {
    setProjectFilter((cur) => (cur === p ? null : p));
  };

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ background: "var(--color-card)" }}>
      <IngatHeader
        screen={screen}
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => runQuery(query)}
        onBack={() => (screen === "detail" ? setScreen("results") : goHome())}
        onGoHome={goHome}
        onGoSettings={() => setScreen("settings")}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {screen === "home" && (
          <IngatHome
            query={query}
            onQueryChange={setQuery}
            onSubmit={() => runQuery(query)}
            placeholder={EXAMPLE_QUERIES[placeholderIndex]}
            recentSearches={recentSearches}
            onRecentClick={runQuery}
            projectFilter={projectFilter}
            onToggleProjectFilter={toggleProjectFilter}
          />
        )}

        {screen === "results" && (
          <IngatResults query={submittedQuery} entry={result.entry} onOpenSource={openSource} onBroaden={goHome} />
        )}

        {screen === "detail" && selectedSource && <IngatSourceDetail source={selectedSource} />}

        {screen === "settings" && <IngatSettings />}
      </div>
    </div>
  );
}

interface IngatHeaderProps {
  screen: IngatScreen;
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onGoSettings: () => void;
}

function IngatHeader({ screen, query, onQueryChange, onSubmit, onBack, onGoHome, onGoSettings }: IngatHeaderProps) {
  const isHome = screen === "home";
  const headingRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-2.5 border-b px-4 py-3"
      style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}
    >
      {isHome ? (
        <>
          <button ref={headingRef} onClick={onGoHome} className="font-display text-[18px] font-semibold" style={{ color: "var(--color-ink)" }}>
            Ingat
          </button>
          <div className="flex-1" />
        </>
      ) : (
        <>
          <button
            onClick={onBack}
            aria-label="Kembali"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
            style={{ background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <SearchBar value={query} onChange={onQueryChange} onSubmit={onSubmit} placeholder="Cari lagi…" size="compact" />
          </div>
        </>
      )}
      <button
        onClick={onGoSettings}
        aria-label="Pengaturan"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
        style={{ background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M19.4 13a7.97 7.97 0 0 0 0-2l2.1-1.6-2-3.4-2.5 1a8 8 0 0 0-1.7-1L14.9 3h-4l-.4 2.9a8 8 0 0 0-1.7 1l-2.5-1-2 3.4L6.4 11a7.97 7.97 0 0 0 0 2l-2.1 1.6 2 3.4 2.5-1a8 8 0 0 0 1.7 1l.4 2.9h4l.4-2.9a8 8 0 0 0 1.7-1l2.5 1 2-3.4-2.1-1.6Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
