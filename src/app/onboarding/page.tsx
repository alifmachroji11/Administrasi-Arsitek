"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoPlate } from "@/components/PhotoPlate";
import { BOT_DISPLAY_NUMBER as BOT_NUMBER } from "@/lib/constants";

type Stage = "bot-number" | "enter-phone" | "enter-code" | "start-project";

export default function OnboardingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("bot-number");
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const copyNumber = () => {
    navigator.clipboard?.writeText(BOT_NUMBER.replace(/\D/g, "")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const sendOtp = async () => {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/whatsapp/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Gagal mengirim kode.");
      return;
    }
    setPhone(data.phoneNumber); // normalized form — must match what verify looks up
    setDevCode(data.devOnlyCode ?? null);
    setStage("enter-code");
  };

  const verifyOtp = async () => {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/whatsapp/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Kode salah.");
      return;
    }
    setStage("start-project");
  };

  const finish = async () => {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName, client: clientName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Gagal membuat proyek.");
      return;
    }
    router.push("/projects");
  };

  const stepIndex = stage === "bot-number" || stage === "enter-phone" || stage === "enter-code" ? 1 : 2;

  return (
    <div className="mx-auto flex min-h-svh max-w-[480px] flex-col px-6 pt-6 pb-8" style={{ background: "var(--color-paper)" }}>
      <div className="mb-8 flex items-center justify-between">
        <span className="font-display text-[16px] font-semibold" style={{ color: "var(--color-ink)" }}>
          NotulArs
        </span>
        <div className="flex gap-1.5">
          <span className="h-[5px] w-5 rounded-full" style={{ background: stepIndex === 1 ? "var(--color-accent)" : "var(--color-stone)" }} />
          <span className="h-[5px] w-5 rounded-full" style={{ background: stepIndex === 2 ? "var(--color-accent)" : "var(--color-stone)" }} />
        </div>
      </div>

      {stage === "bot-number" && (
        <>
          <h1 className="font-display mb-2.5 text-[26px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            Hubungkan Nomor WhatsApp
          </h1>
          <p className="mb-7 text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Simpan nomor bot NotulArs ini di kontak kamu. Semua yang kamu forward ke sini otomatis tersusun rapi per proyek.
          </p>

          <div className="mb-5 rounded-[20px] p-6 text-center" style={{ background: "var(--color-card)", boxShadow: "var(--shadow-card)" }}>
            <p className="font-mono-meta mb-1 text-[21px] font-semibold tracking-wide" style={{ color: "var(--color-ink)" }}>
              {BOT_NUMBER}
            </p>
            <p className="mb-5 text-[12.5px]" style={{ color: "var(--color-ink-faint)" }}>
              NotulArs Assistant
            </p>
            <button
              onClick={copyNumber}
              className="w-full rounded-xl border py-3 text-[14px] font-semibold"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
            >
              {copied ? "Tersalin ✓" : "Salin Nomor"}
            </button>
          </div>

          <div className="flex-1" />
          <button
            onClick={() => setStage("enter-phone")}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-[#fdf6ea]"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            Lanjut, Verifikasi Nomorku
          </button>
        </>
      )}

      {stage === "enter-phone" && (
        <>
          <h1 className="font-display mb-2.5 text-[24px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            Nomor WhatsApp Kamu
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Supaya pesan yang kamu forward otomatis dikenali sebagai milikmu. Kami kirim kode verifikasi 6-digit ke nomor ini lewat WhatsApp.
          </p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08123456789"
            className="mb-3 rounded-xl border px-4 py-3.5 text-[15px] outline-none"
            style={{ borderColor: "var(--color-stone-line)", background: "var(--color-card)", color: "var(--color-ink)" }}
          />
          {error && <p className="mb-3 text-[13px]" style={{ color: "var(--color-accent)" }}>{error}</p>}
          <div className="flex-1" />
          <button
            onClick={sendOtp}
            disabled={loading || !phone}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-[#fdf6ea] disabled:opacity-60"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            {loading ? "Mengirim…" : "Kirim Kode Verifikasi"}
          </button>
        </>
      )}

      {stage === "enter-code" && (
        <>
          <h1 className="font-display mb-2.5 text-[24px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            Masukkan Kode
          </h1>
          <p className="mb-3 text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Kami kirim kode 6-digit ke {phone} lewat WhatsApp.
          </p>
          {devCode && (
            <p
              className="font-mono-meta mb-4 rounded-lg px-3 py-2 text-[12.5px]"
              style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-soft-ink)" }}
            >
              Mode pengembangan (belum tersambung ke WhatsApp asli): kode kamu adalah <strong>{devCode}</strong>
            </p>
          )}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="font-mono-meta mb-3 rounded-xl border px-4 py-3.5 text-center text-[20px] tracking-[0.3em] outline-none"
            style={{ borderColor: "var(--color-stone-line)", background: "var(--color-card)", color: "var(--color-ink)" }}
          />
          {error && <p className="mb-3 text-[13px]" style={{ color: "var(--color-accent)" }}>{error}</p>}
          <div className="flex-1" />
          <button
            onClick={verifyOtp}
            disabled={loading || code.length < 6}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-[#fdf6ea] disabled:opacity-60"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            {loading ? "Memverifikasi…" : "Verifikasi"}
          </button>
        </>
      )}

      {stage === "start-project" && (
        <>
          <h1 className="font-display mb-2.5 text-[24px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            Mulai Forward dari Lokasi
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Forward pesan ke nomor ini, atau tambahkan NotulArs sebagai anggota di grup WhatsApp proyek kamu.
          </p>

          <div className="mb-6 rounded-[20px] p-4" style={{ background: "#e5ddd0", boxShadow: "var(--shadow-card)" }}>
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
                terkirim ke NotulArs ✓✓
              </span>
            </div>
          </div>

          <label className="mb-2 block text-[12.5px] font-medium" style={{ color: "var(--color-ink-soft)" }}>
            Nama proyek pertamamu
          </label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="mis. Renovasi Rumah Bu Sari"
            className="mb-2.5 rounded-xl border px-4 py-3 text-[14.5px] outline-none"
            style={{ borderColor: "var(--color-stone-line)", background: "var(--color-card)", color: "var(--color-ink)" }}
          />
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nama klien (opsional)"
            className="mb-3 rounded-xl border px-4 py-3 text-[14.5px] outline-none"
            style={{ borderColor: "var(--color-stone-line)", background: "var(--color-card)", color: "var(--color-ink)" }}
          />
          {error && <p className="mb-3 text-[13px]" style={{ color: "var(--color-accent)" }}>{error}</p>}

          <div className="flex-1" />
          <button
            onClick={finish}
            disabled={loading || !projectName.trim()}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-[#fdf6ea] disabled:opacity-60"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            {loading ? "Menyimpan…" : "Selesai, Mulai Pantau"}
          </button>
        </>
      )}
    </div>
  );
}
