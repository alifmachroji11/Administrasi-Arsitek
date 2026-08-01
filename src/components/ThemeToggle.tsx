"use client";

import { useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "notula-theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.4 14.7A8.7 8.7 0 1 1 9.3 3.6a7 7 0 0 0 11.1 11.1Z" />
    </svg>
  );
}

/**
 * A compact icon-only light/dark switch — two small buttons rather than a
 * labeled control, so it drops into a nav bar or settings row without
 * competing for space.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Reads the value the inline bootstrap script already applied to <html>
    // — genuinely reading external (DOM/localStorage) state at mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState((document.documentElement.getAttribute("data-theme") as Theme | null) ?? "light");
  }, []);

  const choose = (next: Theme) => {
    setThemeState(next);
    applyTheme(next);
  };

  return (
    <span
      className={className}
      role="group"
      aria-label="Tema tampilan"
      style={{
        display: "inline-flex",
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: "var(--color-paper-dim)",
        border: "1px solid var(--color-stone-line)",
      }}
    >
      <button
        type="button"
        aria-label="Mode terang"
        aria-pressed={theme === "light"}
        onClick={() => choose("light")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          color: theme === "light" ? "var(--color-card)" : "var(--color-ink-faint)",
          background: theme === "light" ? "var(--color-accent)" : "transparent",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        aria-label="Mode gelap"
        aria-pressed={theme === "dark"}
        onClick={() => choose("dark")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          color: theme === "dark" ? "var(--color-card)" : "var(--color-ink-faint)",
          background: theme === "dark" ? "var(--color-accent)" : "transparent",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
      >
        <MoonIcon />
      </button>
    </span>
  );
}
