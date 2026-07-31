"use client";

export function ProfilPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--color-paper-dim)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.4" stroke="var(--color-ink-faint)" strokeWidth="1.8" />
          <path d="M5 20c1.3-3.6 4-5.4 7-5.4s5.7 1.8 7 5.4" stroke="var(--color-ink-faint)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="font-display mb-1.5 text-[18px] font-semibold" style={{ color: "var(--color-ink)" }}>
        Segera hadir
      </h2>
      <p className="max-w-[260px] text-[13.5px] leading-relaxed" style={{ color: "var(--color-ink-faint)" }}>
        Pengaturan akun dan preferensi laporan akan ada di sini.
      </p>
    </div>
  );
}
