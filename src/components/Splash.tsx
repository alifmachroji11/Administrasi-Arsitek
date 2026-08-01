"use client";

import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/BrandLogo";

const DEFAULT_HOLD_MS = 900;
const FADE_MS = 500;

export function Splash({ holdMs = DEFAULT_HOLD_MS, onDone }: { holdMs?: number; onDone?: () => void }) {
  const [stage, setStage] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduceMotion ? 150 : holdMs;
    const fade = reduceMotion ? 0 : FADE_MS;
    const outTimer = window.setTimeout(() => setStage("out"), hold);
    const doneTimer = window.setTimeout(() => {
      setStage("done");
      onDone?.();
    }, hold + fade);
    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fires once on mount by design
  }, []);

  if (stage === "done") return null;

  return (
    <div className={`brandSplash${stage === "out" ? " brandSplashOut" : ""}`} role="presentation">
      <div className="brandSplashMark">
        <BrandWordmark iconSize={56} textSize={26} gap={16} animate />
      </div>
    </div>
  );
}
