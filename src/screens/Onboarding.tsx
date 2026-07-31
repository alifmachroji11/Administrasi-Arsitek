import { useState } from "react";
import { PhotoPlate } from "../components/PhotoPlate";

interface OnboardingProps {
  onClose: () => void;
  onFinish: () => void;
}

const BOT_NUMBER = "+62 812-3456-7890";

export function Onboarding({ onClose, onFinish }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  const copyNumber = () => {
    navigator.clipboard?.writeText(BOT_NUMBER.replace(/\D/g, "")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col px-6 pt-6 pb-8">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[15px]"
          style={{ background: "var(--color-paper-dim)", color: "var(--color-ink-soft)" }}
        >
          ✕
        </button>
        <div className="flex gap-1.5">
          <span className="h-[5px] w-5 rounded-full" style={{ background: step === 1 ? "var(--color-accent)" : "var(--color-stone)" }} />
          <span className="h-[5px] w-5 rounded-full" style={{ background: step === 2 ? "var(--color-accent)" : "var(--color-stone)" }} />
        </div>
      </div>

      {step === 1 ? (
        <>
          <h1 className="font-display mb-2.5 text-[26px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            Hubungkan Nomor WhatsApp
          </h1>
          <p className="mb-7 text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Simpan nomor bot Notula ini di kontak kamu. Semua yang kamu forward ke sini otomatis tersusun rapi per proyek.
          </p>

          <div
            className="mb-5 rounded-[20px] p-6 text-center"
            style={{ background: "var(--color-card)", boxShadow: "var(--shadow-card)" }}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--color-accent-soft)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 3.5a10 10 0 0 0-14.8 12L2 21l5.7-1.5A10 10 0 1 0 17 3.5Z"
                  stroke="var(--color-accent)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.3 8.4c.2-.5.5-.5.8-.5h.6c.2 0 .5 0 .7.5.2.6.7 1.9.7 2 .1.2.1.4 0 .6-.1.2-.2.3-.4.5-.2.2-.4.4-.2.7.2.4 1 1.6 2.1 2.5 1.4 1.2 2.1 1.3 2.5 1.1.2-.1.5-.4.6-.6.2-.3.4-.2.7-.1l1.8.9c.3.1.5.2.5.5.1.7-.2 1.5-.8 2-.5.4-1 .6-1.6.6-1.6 0-3.6-.8-5.6-2.6-2.1-2-3.1-4-3.2-5.6 0-.6.2-1.2.6-1.6Z"
                  fill="var(--color-accent)"
                />
              </svg>
            </div>
            <p className="font-mono-meta mb-1 text-[21px] font-semibold tracking-wide" style={{ color: "var(--color-ink)" }}>
              {BOT_NUMBER}
            </p>
            <p className="mb-5 text-[12.5px]" style={{ color: "var(--color-ink-faint)" }}>
              Notula Assistant
            </p>
            <button
              onClick={copyNumber}
              className="w-full rounded-xl border py-3 text-[14px] font-semibold transition-colors"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", background: "transparent" }}
            >
              {copied ? "Tersalin ✓" : "Salin Nomor"}
            </button>
          </div>

          <div className="flex-1" />
          <button
            onClick={() => setStep(2)}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-[#fdf6ea] transition-transform active:scale-[0.98]"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            Lanjut
          </button>
        </>
      ) : (
        <>
          <h1 className="font-display mb-2.5 text-[26px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            Mulai Forward dari Lokasi
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Forward pesan ke nomor ini, atau tambahkan Notula sebagai anggota di grup WhatsApp proyek kamu.
          </p>

          <div className="mb-7 rounded-[20px] p-4" style={{ background: "#e5ddd0", boxShadow: "var(--shadow-card)" }}>
            <div className="flex flex-col items-end gap-1.5">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#dcf8c6] p-3">
                <div className="mb-2 flex items-center gap-1 text-[10.5px] font-medium text-[#5d7a52]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M13 6 6 12l7 6M6 12h12" stroke="#5d7a52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Diteruskan
                </div>
                <PhotoPlate label="Foto Lapangan" tone={0} className="h-[72px] w-40" rounded="rounded-lg" />
              </div>
              <span className="text-[10.5px]" style={{ color: "#8b8478" }}>
                terkirim ke Notula ✓✓
              </span>
            </div>
          </div>

          <div className="flex-1" />
          <button
            onClick={onFinish}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-[#fdf6ea] transition-transform active:scale-[0.98]"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            Selesai, Mulai Pantau
          </button>
        </>
      )}
    </div>
  );
}
