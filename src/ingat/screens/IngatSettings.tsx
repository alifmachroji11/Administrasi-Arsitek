import { useState } from "react";
import { CONNECTED_SOURCES } from "../data/searchIndex";
import type { ConnectedSourceKind } from "../lib/types";

function SourceIcon({ kind }: { kind: ConnectedSourceKind }) {
  if (kind === "whatsapp") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 3.5a10 10 0 0 0-14.8 12L2 21l5.7-1.5A10 10 0 1 0 17 3.5Z"
          stroke="var(--color-ink)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "drive") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 3h8l6 6v12H6V3Z" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3v6h6" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="var(--color-ink)" strokeWidth="1.8" />
      <circle cx="9" cy="11" r="2" stroke="var(--color-ink)" strokeWidth="1.8" />
      <path d="m5 17 4.5-4 3 2.5L18 11l1 2" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IngatSettings() {
  const [sources, setSources] = useState(CONNECTED_SOURCES);

  const toggle = (kind: ConnectedSourceKind) => {
    setSources((prev) =>
      prev.map((s) =>
        s.kind === kind
          ? { ...s, connected: !s.connected, lastSync: !s.connected ? "Disinkronkan baru saja" : "Belum pernah disinkronkan" }
          : s,
      ),
    );
  };

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 py-6">
      <h1 className="font-display mb-1 text-[20px] font-semibold" style={{ color: "var(--color-ink)" }}>
        Kelola Sumber Terhubung
      </h1>
      <p className="mb-6 text-[13.5px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
        Ingat membaca dari sumber yang kamu hubungkan untuk menjawab pertanyaan.
      </p>

      <div className="flex flex-col gap-3">
        {sources.map((s) => (
          <div
            key={s.kind}
            className="flex items-center gap-3.5 rounded-[16px] border p-4"
            style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}
          >
            <div
              className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
              style={{ background: "var(--color-paper-dim)" }}
            >
              <SourceIcon kind={s.kind} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold" style={{ color: "var(--color-ink)" }}>
                {s.name}
              </p>
              <p className="text-[12.5px]" style={{ color: "var(--color-ink-faint)" }}>
                {s.description}
              </p>
              <p className="font-mono-meta mt-1 text-[10.5px]" style={{ color: s.connected ? "var(--color-accent)" : "var(--color-ink-faint)" }}>
                {s.lastSync}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={s.connected}
              aria-label={`${s.connected ? "Putuskan" : "Hubungkan"} ${s.name}`}
              onClick={() => toggle(s.kind)}
              className="relative h-7 w-12 flex-none rounded-full transition-colors"
              style={{ background: s.connected ? "var(--color-accent)" : "var(--color-stone)" }}
            >
              <span
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{ left: s.connected ? "26px" : "4px" }}
              />
            </button>
          </div>
        ))}
      </div>

      <div
        className="mt-6 rounded-[16px] p-4 text-[12.5px] leading-relaxed"
        style={{ background: "var(--color-paper-dim)", color: "var(--color-ink-soft)" }}
      >
        <strong style={{ color: "var(--color-ink)" }}>Privasi:</strong> Ingat hanya membaca, tidak pernah mengirim pesan
        atas nama kamu. Data yang tersinkron hanya dipakai untuk menjawab pertanyaanmu sendiri.
      </div>
    </div>
  );
}
