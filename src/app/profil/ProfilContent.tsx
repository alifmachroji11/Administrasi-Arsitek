"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { ConnectedSources } from "@/screens/ConnectedSources";

interface Me {
  name: string;
  email: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase() || "?";
}

export function ProfilContent() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setMe({ name: data.name, email: data.email }));
  }, []);

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
