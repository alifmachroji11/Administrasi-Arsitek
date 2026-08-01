"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { BrandWordmark } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

function LoginFormInner({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email atau kata sandi salah.");
      return;
    }
    router.push(params.get("next") || "/projects");
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6 py-10" style={{ background: "var(--color-paper)" }}>
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[380px]">
        <div className="mb-1.5 flex items-center justify-center">
          <BrandWordmark iconSize={32} textSize={28} />
        </div>
        <p className="mb-8 text-center text-[14px]" style={{ color: "var(--color-ink-soft)" }}>
          Masuk ke akunmu
        </p>

        <div className="rounded-[20px] p-6" style={{ background: "var(--color-card)", boxShadow: "var(--shadow-card)" }}>
          <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@studio.com" />
            <Field label="Kata Sandi" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

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
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>

          {googleEnabled && <GoogleSignInButton callbackUrl="/projects" />}
        </div>

        <p className="mt-5 text-center text-[13.5px]" style={{ color: "var(--color-ink-soft)" }}>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Daftar
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

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  return (
    <Suspense>
      <LoginFormInner googleEnabled={googleEnabled} />
    </Suspense>
  );
}
