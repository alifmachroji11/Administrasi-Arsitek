"use client";

interface EmptyStateProps {
  onConnect: () => void;
}

const STEPS = [
  <>
    Simpan <b>nomor WhatsApp NotulArs</b> ke kontakmu.
  </>,
  <>Forward foto, voice note, atau chat dari proyek pertamamu.</>,
  <>
    NotulArs otomatis merapikannya di sini — <b>tanpa input manual</b>.
  </>,
];

export function EmptyState({ onConnect }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <svg width="132" height="104" viewBox="0 0 132 104" fill="none" className="mb-7">
        <rect x="8" y="18" width="66" height="46" rx="8" transform="rotate(-8 8 18)" fill="var(--color-stone)" opacity="0.55" />
        <rect x="20" y="10" width="66" height="46" rx="8" transform="rotate(4 20 10)" fill="var(--color-accent-soft)" />
        <rect x="30" y="24" width="72" height="50" rx="9" fill="var(--color-card)" stroke="var(--color-stone-line)" />
        <path d="M42 40h32M42 49h44M42 58h26" stroke="var(--color-ink-faint)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="104" cy="66" r="15" fill="var(--color-accent)" />
        <path d="M98 66.5 102.2 71 111 61" stroke="var(--color-card)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <h2 className="font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>
        Belum ada proyek di sini
      </h2>
      <p className="mx-auto mt-2 mb-8 max-w-[280px] text-[14px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
        NotulArs akan menyusun semua tangkapan lapanganmu secara otomatis, begitu proyek pertama terhubung.
      </p>

      <ol className="mb-8 flex w-full max-w-[280px] flex-col gap-4 text-left">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex h-6 w-6 flex-none items-center justify-center rounded-full font-mono-meta text-[12px] font-semibold text-[var(--color-accent-on)]"
              style={{ background: "var(--color-accent)" }}
            >
              {i + 1}
            </span>
            <span className="pt-0.5 text-[14px] leading-snug" style={{ color: "var(--color-ink)" }}>
              {step}
            </span>
          </li>
        ))}
      </ol>

      <button
        onClick={onConnect}
        className="w-full max-w-[280px] rounded-2xl px-6 py-4 text-[15px] font-semibold text-[var(--color-accent-on)] transition-transform active:scale-[0.98]"
        style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
      >
        Hubungkan Nomor WhatsApp
      </button>
    </div>
  );
}
