const BLUEPRINT_BLUE = "oklch(0.58 0.16 250)";
const BLUEPRINT_BLUE_SOFT = "rgba(13, 125, 212, 0.8)";
const CREAM = "#F2F1EC";

type BrandLogoTone = "ink" | "onDark" | "mono";

interface BrandLogoProps {
  size?: number;
  tone?: BrandLogoTone;
  rounded?: boolean;
  bg?: string;
  /** Animate the dimension-tick crossbar drawing in from its center. */
  animate?: boolean;
  className?: string;
}

/**
 * The NotulArs monogram: two structural columns joined by a diagonal "A"
 * stroke (forming an "N" silhouette), with a dimension-tick crossbar
 * referencing a floor plan/section cut — the blueprint motif.
 */
export function BrandLogo({ size = 28, tone = "ink", rounded = false, bg, animate = false, className }: BrandLogoProps) {
  const legColor = tone === "onDark" ? CREAM : "var(--brand-mark-ink)";
  const accentColor = tone === "mono" ? legColor : BLUEPRINT_BLUE;
  const crossbarColor = tone === "mono" ? legColor : BLUEPRINT_BLUE_SOFT;

  const mark = (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <rect x="24" y="18" width="12" height="64" fill={legColor} />
      <rect x="64" y="18" width="12" height="64" fill={legColor} />
      <polygon points="36,18 64,18 76,82 64,82" fill={accentColor} />
      <rect
        x="24"
        y="46"
        width="52"
        height="8"
        fill={crossbarColor}
        style={
          animate
            ? { transformOrigin: "50px 50px", animation: "brand-tick-draw 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both" }
            : undefined
        }
      />
    </svg>
  );

  if (!bg && !rounded) return <span className={className}>{mark}</span>;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size * 1.55,
        height: size * 1.55,
        borderRadius: rounded ? size * 0.42 : 0,
        background: bg,
      }}
    >
      {mark}
    </span>
  );
}

export function BrandWordmark({
  iconSize = 22,
  textSize = 20,
  gap = 9,
  tone = "ink",
  animate = false,
  className,
}: {
  iconSize?: number;
  textSize?: number | string;
  gap?: number;
  tone?: BrandLogoTone;
  animate?: boolean;
  className?: string;
}) {
  const textColor = tone === "onDark" ? CREAM : "var(--brand-mark-ink)";
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap }}>
      <BrandLogo size={iconSize} tone={tone} animate={animate} />
      <span
        style={{
          fontFamily: "var(--font-brand)",
          fontWeight: 600,
          fontSize: textSize,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color: textColor,
        }}
      >
        Notul<span style={{ color: tone === "mono" ? textColor : BLUEPRINT_BLUE }}>Ars</span>
      </span>
    </span>
  );
}
