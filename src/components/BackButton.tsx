"use client";

export function BackButton({ onClick, label = "Kembali" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 flex-none items-center justify-center rounded-full transition-colors"
      style={{ background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
