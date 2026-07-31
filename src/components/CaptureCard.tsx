"use client";

import type { Capture } from "../lib/types";
import { TAG_META } from "../lib/tags";
import { PhotoPlate } from "./PhotoPlate";
import { VoiceMark } from "./VoiceMark";
import { TagChip } from "./TagChip";

interface CaptureCardProps {
  capture: Capture;
  expanded: boolean;
  onToggle: () => void;
}

export function CaptureCard({ capture, expanded, onToggle }: CaptureCardProps) {
  const meta = TAG_META[capture.tag];

  return (
    <button
      onClick={onToggle}
      className="block w-full rounded-[18px] p-4 text-left"
      style={{ background: "var(--color-card)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <TagChip label={capture.tag} fg={meta.fg} bg={meta.bg} size="sm" />
        <time className="font-mono-meta flex-none text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
          {capture.timeLabel}
        </time>
      </div>

      {capture.kind === "photo" && (
        <PhotoPlate label={`Foto — ${capture.photoLabel}`} tone={capture.photoTone} className="mb-2.5 h-36 w-full" />
      )}

      {capture.kind === "voice" && <div className="mb-2">
        <VoiceMark />
      </div>}

      <p
        className={`text-[14px] leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
        style={{ color: "var(--color-ink)" }}
      >
        {capture.text}
      </p>
    </button>
  );
}
