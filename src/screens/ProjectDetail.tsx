"use client";

import type { Project, ReportRange, Tag } from "../lib/types";
import { TAG_LIST, TAG_META } from "../lib/tags";
import { TagChip } from "../components/TagChip";
import { CaptureCard } from "../components/CaptureCard";
import { BackButton } from "../components/BackButton";

interface ProjectDetailProps {
  project: Project | null;
  activeTag: Tag | null;
  expandedId: string | null;
  reportRange: ReportRange;
  onBack: () => void;
  onToggleTag: (tag: Tag | null) => void;
  onToggleExpand: (id: string) => void;
  onSetRange: (range: ReportRange) => void;
  onBuildReport: () => void;
}

export function ProjectDetail({
  project,
  activeTag,
  expandedId,
  reportRange,
  onBack,
  onToggleTag,
  onToggleExpand,
  onSetRange,
  onBuildReport,
}: ProjectDetailProps) {
  if (!project) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-[14px]" style={{ color: "var(--color-ink-faint)" }}>
          Pilih proyek untuk melihat detail
        </p>
      </div>
    );
  }

  const captures = project.captures.filter((c) => !activeTag || c.tag === activeTag);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pt-5 pb-1">
        <BackButton onClick={onBack} />
        <div className="min-w-0">
          <h2 className="font-display truncate text-[18px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
            {project.name}
          </h2>
          <p className="truncate text-[12px]" style={{ color: "var(--color-ink-faint)" }}>
            {project.client}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 py-3">
        <TagChip
          label="Semua"
          fg="var(--color-ink)"
          bg="var(--color-paper-dim)"
          active={activeTag === null}
          interactive
          onClick={() => onToggleTag(null)}
        />
        {TAG_LIST.map((tag) => {
          const meta = TAG_META[tag];
          return (
            <TagChip
              key={tag}
              label={tag}
              fg={meta.fg}
              bg={meta.bg}
              active={activeTag === tag}
              interactive
              onClick={() => onToggleTag(activeTag === tag ? null : tag)}
            />
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3">
        <div className="flex flex-col gap-3.5">
          {captures.map((c) => (
            <CaptureCard key={c.id} capture={c} expanded={expandedId === c.id} onToggle={() => onToggleExpand(c.id)} />
          ))}
          {captures.length === 0 && (
            <p className="py-10 text-center text-[13.5px]" style={{ color: "var(--color-ink-faint)" }}>
              Belum ada tangkapan dengan tag ini.
            </p>
          )}
        </div>
      </div>

      <div
        className="sticky bottom-0 px-5 pt-4 pb-4"
        style={{ background: "linear-gradient(180deg, rgba(251,249,244,0), var(--color-paper-dim) 30%)" }}
      >
        <div className="mb-2.5 flex gap-2">
          <RangeButton label="7 Hari Terakhir" active={reportRange === "week"} onClick={() => onSetRange("week")} />
          <RangeButton label="Semua Waktu" active={reportRange === "all"} onClick={() => onSetRange("all")} />
        </div>
        <button
          onClick={onBuildReport}
          className="w-full rounded-2xl px-6 py-4 text-[14.5px] font-semibold text-[var(--color-accent-on)] transition-transform active:scale-[0.98]"
          style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
        >
          Buat Laporan dari Rentang Ini
        </button>
      </div>
    </div>
  );
}

function RangeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-xl border py-2.5 text-[12.5px] font-medium transition-colors"
      style={
        active
          ? { background: "var(--color-accent)", color: "var(--color-accent-on)", borderColor: "var(--color-accent)" }
          : { background: "var(--color-card)", color: "var(--color-ink-soft)", borderColor: "var(--color-stone-line)" }
      }
    >
      {label}
    </button>
  );
}
