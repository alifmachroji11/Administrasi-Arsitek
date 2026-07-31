"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { ConnectedSources } from "@/screens/ConnectedSources";

interface Me {
  name: string;
  email: string;
}

type Status = "loading" | "loaded" | "error";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase() || "?";
}

export function ProfilContent() {
  const [me, setMe] = useState<Me | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const load = useCallback(() => {
    setStatus("loading");
    fetch("/api/me")
      .then(async (r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setMe({ name: data.name, email: data.email });
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    // Genuinely async (fetch) — see the same documented exception in
    // src/screens/ConnectedSources.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  if (status === "error") {
    return (
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center px-5 py-16 text-center">
        <p className="mb-1.5 text-[15px] font-semibold" style={{ color: "var(--color-ink)" }}>
          Tidak bisa memuat profil
        </p>
        <p className="mb-6 max-w-[280px] text-[13.5px] leading-relaxed" style={{ color: "var(--color-ink-faint)" }}>
          Sesi kamu mungkin sudah tidak berlaku. Coba lagi, atau masuk ulang.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={load}
            className="rounded-xl border px-4 py-2.5 text-[13.5px] font-medium"
            style={{ borderColor: "var(--color-stone-line)", color: "var(--color-ink)" }}
          >
            Coba Lagi
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-[#fdf6ea]"
            style={{ background: "var(--color-accent)" }}
          >
            Masuk Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 py-6">
      <div className="mb-6 flex items-center gap-3.5">
        <div
          className="flex h-14 w-14 flex-none items-center justify-center rounded-full text-[18px] font-semibold"
          style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-soft-ink)" }}
        >
          {me ? initials(me.name) : "…"}
        </div>
        <div className="min-w-0">
          <h1 className="font-display truncate text-[19px] font-semibold" style={{ color: "var(--color-ink)" }}>
            {me?.name ?? "Memuat…"}
          </h1>
          <p className="truncate text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
            {me?.email ?? ""}
          </p>
        </div>
      </div>

      <ConnectedSources />

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-6 w-full rounded-xl border py-3 text-[14px] font-medium"
        style={{ borderColor: "var(--color-stone-line)", color: "var(--color-accent)" }}
      >
        Keluar
      </button>
    </div>
  );
}
