"use client";

import type { Source } from "../lib/types";
import { PhotoPlate } from "../../components/PhotoPlate";

interface SourceCardProps {
  source: Source;
  onClick: () => void;
}

const KIND_LABEL: Record<Source["kind"], string> = {
  chat: "WhatsApp",
  photo: "Foto",
  drive: "Google Drive",
};

function KindIcon({ kind }: { kind: Source["kind"] }) {
  if (kind === "chat") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 3.5a10 10 0 0 0-14.8 12L2 21l5.7-1.5A10 10 0 1 0 17 3.5Z"
          stroke="var(--color-ink-faint)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "drive") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M6 3h8l6 6v12H6V3Z" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3v6h6" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="var(--color-ink-faint)" strokeWidth="1.8" />
      <circle cx="9" cy="11" r="2" stroke="var(--color-ink-faint)" strokeWidth="1.8" />
      <path d="m5 17 4.5-4 3 2.5L18 11l1 2" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SourceCard({ source, onClick }: SourceCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[16px] border p-4 text-left transition-colors"
      style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}
    >
      {source.kind === "photo" ? (
        <PhotoPlate label={source.photoLabel ?? ""} tone={source.photoTone} className="h-14 w-14 flex-none" rounded="rounded-[10px]" />
      ) : (
        <div
          className="flex h-14 w-14 flex-none items-center justify-center rounded-[10px]"
          style={{ background: "var(--color-paper-dim)" }}
        >
          <KindIcon kind={source.kind} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <KindIcon kind={source.kind} />
          <span className="font-mono-meta text-[10.5px] font-medium uppercase" style={{ color: "var(--color-ink-faint)" }}>
            {KIND_LABEL[source.kind]}
          </span>
        </div>
        <p className="line-clamp-2 text-[13.5px] leading-snug" style={{ color: "var(--color-ink)" }}>
          {source.kind === "drive" ? source.fileName : source.snippet}
        </p>
        <p className="font-mono-meta mt-1.5 text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
          {source.project} · {source.dateLabel}
        </p>
      </div>
    </button>
  );
}
