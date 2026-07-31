"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WhatsAppMark, DriveMark, GalleryMark } from "@/components/BrandIcons";

const STORAGE_KEY = "notula:connected-sources";

interface MockToggles {
  drive: boolean;
  gallery: boolean;
}

function loadToggles(): MockToggles {
  if (typeof window === "undefined") return { drive: false, gallery: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { drive: false, gallery: false };
    const parsed = JSON.parse(raw);
    return { drive: Boolean(parsed.drive), gallery: Boolean(parsed.gallery) };
  } catch {
    return { drive: false, gallery: false };
  }
}

export function ConnectedSources() {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null | undefined>(undefined);
  // Default matches what the server renders (no localStorage there) so the
  // client's hydration pass produces identical HTML — no mismatch. The real
  // value is applied in the effect below, strictly after hydration, as an
  // ordinary post-mount update rather than during the hydration render
  // itself. This is the "synchronize with an external system" case
  // react.dev calls out as a legitimate effect; the lint rule can't
  // distinguish it from an avoidable one, hence the targeted disable.
  const [toggles, setToggles] = useState<MockToggles>({ drive: false, gallery: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
    setToggles(loadToggles());
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setWhatsappNumber(data?.whatsappVerifiedNumber ?? null));
  }, []);

  const toggle = (key: keyof MockToggles) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const whatsappConnected = Boolean(whatsappNumber);

  return (
    <div>
      <p className="mb-3 text-[11.5px] font-semibold uppercase" style={{ color: "var(--color-ink-faint)", letterSpacing: "0.06em" }}>
        Sumber Terhubung
      </p>

      <div className="flex flex-col gap-3">
        {/* WhatsApp — reflects the real account, not a toggle */}
        <div
          className="flex items-center gap-3.5 rounded-[16px] border p-4"
          style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}
        >
          <WhatsAppMark size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-semibold" style={{ color: "var(--color-ink)" }}>
              WhatsApp
            </p>
            <p className="text-[12.5px]" style={{ color: "var(--color-ink-faint)" }}>
              Pesan yang diforward ke bot Notula per proyek
            </p>
            {whatsappNumber === undefined ? (
              <p className="font-mono-meta mt-1 text-[10.5px]" style={{ color: "var(--color-ink-faint)" }}>
                Memuat…
              </p>
            ) : whatsappConnected ? (
              <p className="font-mono-meta mt-1 text-[10.5px]" style={{ color: "var(--color-accent)" }}>
                Tersambung · {whatsappNumber}
              </p>
            ) : (
              <p className="font-mono-meta mt-1 text-[10.5px]" style={{ color: "var(--color-ink-faint)" }}>
                Belum tersambung
              </p>
            )}
          </div>
          {whatsappNumber !== undefined && !whatsappConnected && (
            <Link
              href="/onboarding"
              className="flex-none rounded-full px-3.5 py-2 text-[12px] font-semibold text-[#fdf6ea]"
              style={{ background: "var(--color-accent)" }}
            >
              Hubungkan
            </Link>
          )}
        </div>

        {/* Drive / Gallery — mock toggles, no live integration yet, but the
            toggle state now persists (localStorage) instead of resetting to
            the hardcoded default on every remount/navigation. */}
        <ToggleRow
          icon={<DriveMark size={40} />}
          name="Google Drive"
          description="Dokumen, RAB, dan kontrak per folder proyek"
          note={toggles.drive ? "Tersambung" : "Belum tersambung"}
          connected={toggles.drive}
          onToggle={() => toggle("drive")}
        />
        <ToggleRow
          icon={<GalleryMark size={40} />}
          name="Galeri Foto"
          description="Foto lapangan yang tersimpan di perangkat"
          note={toggles.gallery ? "Tersambung" : "Belum tersambung"}
          connected={toggles.gallery}
          onToggle={() => toggle("gallery")}
        />
      </div>

      <div
        className="mt-6 rounded-[16px] p-4 text-[12.5px] leading-relaxed"
        style={{ background: "var(--color-paper-dim)", color: "var(--color-ink-soft)" }}
      >
        <strong style={{ color: "var(--color-ink)" }}>Privasi:</strong> Notula hanya membaca, tidak pernah mengirim
        pesan atas nama kamu. Data yang tersinkron hanya dipakai untuk menyusun catatan dan menjawab pertanyaanmu
        sendiri.
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  name,
  description,
  note,
  connected,
  onToggle,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  note: string;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-[16px] border p-4"
      style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-semibold" style={{ color: "var(--color-ink)" }}>
          {name}
        </p>
        <p className="text-[12.5px]" style={{ color: "var(--color-ink-faint)" }}>
          {description}
        </p>
        <p className="font-mono-meta mt-1 text-[10.5px]" style={{ color: connected ? "var(--color-accent)" : "var(--color-ink-faint)" }}>
          {note}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={connected}
        aria-label={`${connected ? "Putuskan" : "Hubungkan"} ${name}`}
        onClick={onToggle}
        className="relative h-7 w-12 flex-none rounded-full transition-colors"
        style={{ background: connected ? "var(--color-accent)" : "var(--color-stone)" }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ left: connected ? "26px" : "4px" }}
        />
      </button>
    </div>
  );
}
