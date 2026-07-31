import type { Source } from "../lib/types";
import { PhotoPlate } from "../../components/PhotoPlate";

interface IngatSourceDetailProps {
  source: Source;
}

export function IngatSourceDetail({ source }: IngatSourceDetailProps) {
  return (
    <div className="mx-auto w-full max-w-[600px] px-5 py-6">
      <p className="font-mono-meta mb-4 text-[11.5px]" style={{ color: "var(--color-ink-faint)" }}>
        {source.project} · {source.dateLabel}
      </p>

      {source.kind === "chat" && source.context && (
        <div className="rounded-[20px] p-4" style={{ background: "#e5ddd0" }}>
          <div className="flex flex-col gap-2">
            {source.context.map((m, i) => (
              <div key={i} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                  style={{
                    background: m.fromMe ? "#dcf8c6" : "#ffffff",
                    color: "#2b2318",
                    borderTopRightRadius: m.fromMe ? "4px" : undefined,
                    borderTopLeftRadius: !m.fromMe ? "4px" : undefined,
                  }}
                >
                  {m.text}
                  <div className="mt-1 text-right text-[10px]" style={{ color: "#8b8478" }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {source.kind === "photo" && (
        <div>
          <PhotoPlate label={source.photoLabel ?? ""} tone={source.photoTone} className="mb-4 h-64 w-full" />
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
            {source.snippet}
          </p>
        </div>
      )}

      {source.kind === "drive" && (
        <div className="rounded-[20px] border p-6 text-center" style={{ background: "var(--color-card)", borderColor: "var(--color-stone-line)" }}>
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: "var(--color-paper-dim)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 3h8l6 6v12H6V3Z" stroke="var(--color-ink-soft)" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M14 3v6h6" stroke="var(--color-ink-soft)" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mb-1 text-[15px] font-semibold" style={{ color: "var(--color-ink)" }}>
            {source.fileName}
          </p>
          <p className="mb-5 text-[12.5px]" style={{ color: "var(--color-ink-faint)" }}>
            {source.fileType} · {source.fileSize}
          </p>
          <button
            className="rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-[#fdf6ea]"
            style={{ background: "var(--color-accent)" }}
          >
            Buka File Asli
          </button>
        </div>
      )}
    </div>
  );
}
