import type { ReportItem } from "../lib/types";
import { PhotoPlate } from "../components/PhotoPlate";
import { BackButton } from "../components/BackButton";
import { AutoGrowText } from "../components/AutoGrowText";

interface ReportDraftProps {
  title: string;
  rangeLabel: string;
  summary: string;
  items: ReportItem[];
  onBack: () => void;
  onTitleChange: (v: string) => void;
  onSummaryChange: (v: string) => void;
  onCaptionChange: (id: string, v: string) => void;
  onSave: () => void;
  onShare: () => void;
}

export function ReportDraft({
  title,
  rangeLabel,
  summary,
  items,
  onBack,
  onTitleChange,
  onSummaryChange,
  onCaptionChange,
  onSave,
  onShare,
}: ReportDraftProps) {
  return (
    <div className="mx-auto h-full max-w-[680px] overflow-y-auto px-5 pt-5 pb-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <BackButton onClick={onBack} />
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors"
            style={{ borderColor: "var(--color-stone-line)", background: "var(--color-card)", color: "var(--color-ink)" }}
          >
            Simpan sebagai Draf
          </button>
          <button
            onClick={onShare}
            className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#fdf6ea]"
            style={{ background: "var(--color-accent)" }}
          >
            Bagikan ke Klien
          </button>
        </div>
      </div>

      <div className="rounded-[22px] p-7" style={{ background: "var(--color-card)", boxShadow: "var(--shadow-card)" }}>
        <AutoGrowText
          value={title}
          onChange={onTitleChange}
          placeholder="Judul laporan"
          className="font-display block w-full border-none bg-transparent p-0 text-[22px] font-semibold leading-snug outline-none sm:text-[24px]"
          style={{ color: "var(--color-ink)" }}
        />
        <p className="font-mono-meta mt-1.5 mb-6 text-[12px]" style={{ color: "var(--color-ink-faint)" }}>
          {rangeLabel}
        </p>

        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          rows={5}
          className="mb-8 w-full resize-y rounded-2xl border-none p-4 text-[14px] leading-relaxed outline-none"
          style={{ background: "var(--color-paper-dim)", color: "var(--color-ink)" }}
        />

        <p
          className="mb-3.5 text-[11.5px] font-semibold uppercase"
          style={{ color: "var(--color-ink-faint)", letterSpacing: "0.06em" }}
        >
          Foto Terpilih
        </p>

        {items.length === 0 ? (
          <p className="text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
            Tidak ada foto pada rentang ini.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((it) => (
              <div key={it.id}>
                <PhotoPlate label={`Foto — ${it.photoLabel}`} tone={it.tone} className="mb-2.5 h-44 w-full" />
                <AutoGrowText
                  value={it.caption}
                  onChange={(v) => onCaptionChange(it.id, v)}
                  className="w-full border-none bg-transparent p-0 text-[14px] leading-relaxed outline-none"
                  style={{ color: "var(--color-ink)" }}
                  placeholder="Tulis caption…"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
