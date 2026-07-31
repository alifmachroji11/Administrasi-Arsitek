"use client";

import { useEffect, useRef } from "react";

interface AutoGrowTextProps {
  value: string;
  onChange: (v: string) => void;
  className: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

/** Textarea that grows with content — no scrollbars, no clipped titles/captions. */
export function AutoGrowText({ value, onChange, className, style, placeholder }: AutoGrowTextProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`resize-none overflow-hidden ${className}`}
      style={style}
    />
  );
}
