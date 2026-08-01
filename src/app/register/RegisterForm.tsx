"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { BrandLogo } from "@/components/BrandLogo";

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Gagal mendaftar.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/onboarding");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-10" style={{ background: "var(--color-paper)" }}>
      <div className="w-full max-w-[380px]">
        <div className="mb-1.5 flex items-center justify-center gap-2.5">
          <BrandLogo size={30} />
          <h1 className="font-display text-[26px] font-semibold" style={{ color: "var(--color-ink)" }}>
            NotulArs
          </h1>
        </div>
        <p className="mb-8 text-center text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
          Buat akun studio kamu
        </p>

        <div className="rounded-[20px] p-6" style={{ background: "var(--color-card)", boxShadow: "var(--shadow-card)" }}>
          <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
            <Field label="Nama" type="text" value={name} onChange={setName} placeholder="Nama kamu" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@studio.com" />
            <Field label="Kata Sandi" type="password" value={password} onChange={setPassword} placeholder="Minimal 8 karakter" />

            {error && (
              <p className="text-[13px]" style={{ color: "var(--color-accent)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1.5 w-full rounded-xl py-3 text-[14.5px] font-semibold text-[#fdf6ea] transition-transform disabled:opacity-60"
              style={{ background: "var(--color-accent)" }}
            >
              {loading ? "Memproses…" : "Daftar"}
            </button>
          </form>

          {googleEnabled && <GoogleSignInButton callbackUrl="/projects" />}
        </div>

        <p className="mt-5 text-center text-[13.5px]" style={{ color: "var(--color-ink-soft)" }}>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium" style={{ color: "var(--color-ink-soft)" }}>
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
        style={{ borderColor: "var(--color-stone-line)", background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
      />
    </label>
  );
}
