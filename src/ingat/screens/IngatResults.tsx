"use client";

import type { Source } from "../lib/types";
import { AnswerBox } from "../components/AnswerBox";
import { SourceCard } from "../components/SourceCard";

interface IngatResultsProps {
  query: string;
  answer: string | null;
  sources: Source[];
  onOpenSource: (id: string) => void;
  onBroaden: () => void;
}

export function IngatResults({ query, answer, sources, onOpenSource, onBroaden }: IngatResultsProps) {
  if (!answer) {
    return (
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center px-6 py-16 text-center">
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--color-paper-dim)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="var(--color-ink-faint)" strokeWidth="1.8" />
            <path d="m20 20-3.2-3.2" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="font-display mb-2 text-[19px] font-semibold" style={{ color: "var(--color-ink)" }}>
          Belum ketemu jawabannya
        </h2>
        <p className="mb-6 max-w-[320px] text-[13.5px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
          Coba kata kunci lain, sebut nama proyek secara spesifik, atau hubungkan sumber tambahan di Pengaturan supaya
          Ingat bisa membaca lebih banyak riwayat.
        </p>
        <button
          onClick={onBroaden}
          className="rounded-full px-5 py-2.5 text-[13.5px] font-semibold"
          style={{ background: "var(--color-ink)", color: "var(--color-card)" }}
        >
          Coba kata kunci lain
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-5 py-6 md:px-8">
      <p className="mb-3 text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
        Untuk “{query}”
      </p>

      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-start">
        <AnswerBox answer={answer} sourceCount={sources.length} />

        <div className="flex flex-col gap-3">
          {sources.map((s) => (
            <SourceCard key={s.id} source={s} onClick={() => onOpenSource(s.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
