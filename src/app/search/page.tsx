"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { SearchBar } from "@/ingat/components/SearchBar";
import { IngatHome } from "@/ingat/screens/IngatHome";
import { IngatResults } from "@/ingat/screens/IngatResults";
import { IngatSourceDetail } from "@/ingat/screens/IngatSourceDetail";
import type { Source } from "@/ingat/lib/types";

type SearchScreen = "home" | "results" | "detail";

const EXAMPLE_QUERIES = [
  'Coba tanya: "keramik apa yang dipakai di kamar mandi Bu Sari?"',
  'Coba tanya: "material lantai apa di Toko Pak Andi?"',
  'Coba tanya: "warna cat ruang tunggu Klinik Medika apa?"',
  'Coba tanya: "ukuran jendela kamar tidur Rumah Bu Sari?"',
];

export default function SearchPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<SearchScreen>("home");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [projectChips, setProjectChips] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjectChips((d.projects ?? []).map((p: { name: string }) => p.name)));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIndex((i) => (i + 1) % EXAMPLE_QUERIES.length), 3200);
    return () => clearInterval(timer);
  }, []);

  const runQuery = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSubmittedQuery(trimmed);
    setRecentSearches((prev) => [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 4));
    setScreen("results");
    setLoading(true);

    const params = new URLSearchParams({ q: trimmed });
    if (projectFilter) params.set("project", projectFilter);
    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setLoading(false);
    setAnswer(data.answer ?? null);
    setSources(data.sources ?? []);
  };

  const goHome = () => {
    setScreen("home");
    setQuery("");
  };

  const openSource = (id: string) => {
    const found = sources.find((s) => s.id === id) ?? null;
    setSelectedSource(found);
    setScreen("detail");
  };

  const toggleProjectFilter = (p: string) => setProjectFilter((cur) => (cur === p ? null : p));

  return (
    <div
      className="page-transition flex flex-col overflow-hidden"
      style={{ background: "var(--color-card)", height: "var(--app-vh, 100dvh)" }}
    >
      <IngatHeader
        screen={screen}
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => runQuery(query)}
        onBack={() => (screen === "detail" ? setScreen("results") : goHome())}
        onGoHome={goHome}
        onGoSettings={() => router.push("/profil")}
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
            projectChips={projectChips}
          />
        )}

        {screen === "results" &&
          (loading ? (
            <p className="py-16 text-center text-[13.5px]" style={{ color: "var(--color-ink-faint)" }}>
              Mencari…
            </p>
          ) : (
            <IngatResults query={submittedQuery} answer={answer} sources={sources} onOpenSource={openSource} onBroaden={goHome} />
          ))}

        {screen === "detail" && selectedSource && <IngatSourceDetail source={selectedSource} />}
      </div>

      <BottomNav
        active="cari"
        onProyek={() => router.push("/projects")}
        onCari={goHome}
        onProfil={() => router.push("/profil")}
      />
    </div>
  );
}

interface IngatHeaderProps {
  screen: SearchScreen;
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onGoSettings: () => void;
}

function IngatHeader({ screen, query, onQueryChange, onSubmit, onBack, onGoHome, onGoSettings }: IngatHeaderProps) {
  const isHome = screen === "home";
  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-2.5 border-b px-4 py-3"
      style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}
    >
      {isHome ? (
        <>
          <button onClick={onGoHome} className="font-display text-[18px] font-semibold" style={{ color: "var(--color-ink)" }}>
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
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full transition-transform duration-150 ease-out active:scale-90"
        style={{ background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
