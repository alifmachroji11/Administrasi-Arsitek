"use client";

interface PhotoPlateProps {
  label: string;
  tone?: number;
  className?: string;
  rounded?: string;
}

const TONES = [
  "linear-gradient(135deg, #d9c6a5 0%, #c9b088 55%, #b89968 100%)",
  "linear-gradient(135deg, #c9b7a0 0%, #b59d81 55%, #9d8563 100%)",
  "linear-gradient(135deg, #d3c3ab 0%, #bfa886 55%, #a68d67 100%)",
  "linear-gradient(135deg, #cdb99b 0%, #b39a76 55%, #9a7f58 100%)",
];

/**
 * Placeholder for a field photo — reads as an undeveloped print rather
 * than a broken image, with a soft label naming what was captured.
 */
export function PhotoPlate({ label, tone = 0, className = "", rounded = "rounded-2xl" }: PhotoPlateProps) {
  const bg = TONES[tone % TONES.length];
  return (
    <div
      className={`relative flex items-end overflow-hidden ${rounded} ${className}`}
      style={{ background: bg }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(43,35,24,0.12) 0px, rgba(43,35,24,0.12) 1px, transparent 1px, transparent 10px)",
        }}
      />
      <span className="relative m-2.5 rounded-md bg-[rgba(43,35,24,0.55)] px-2 py-1 font-mono-meta text-[10px] font-medium uppercase tracking-wider text-[#fdf6ea]">
        {label}
      </span>
    </div>
  );
}
