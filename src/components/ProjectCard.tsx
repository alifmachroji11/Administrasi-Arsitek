"use client";

import type { Project } from "../lib/types";
import { PhotoPlate } from "./PhotoPlate";

interface ProjectCardProps {
  project: Project;
  active?: boolean;
  onOpen: () => void;
}

export function ProjectCard({ project, active, onOpen }: ProjectCardProps) {
  const latest = project.captures[0];
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-[20px] p-4 text-left transition-transform active:scale-[0.99]"
      style={{
        background: "var(--color-card)",
        boxShadow: "var(--shadow-card)",
        outline: active ? `2px solid var(--color-accent)` : "2px solid transparent",
        outlineOffset: "-2px",
      }}
    >
      <PhotoPlate
        label={latest?.photoLabel ?? project.name.slice(0, 2)}
        tone={project.thumbTone}
        rounded="rounded-[14px]"
        className="h-16 w-16 flex-none"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-display truncate text-[17px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
          {project.name}
        </h3>
        <p className="mt-0.5 truncate text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
          {project.client}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {project.newCount > 0 && (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-soft-ink)" }}
            >
              {project.newCount} tangkapan baru
            </span>
          )}
          <span className="font-mono-meta text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
            {project.lastUpdate}
          </span>
        </div>
      </div>
    </button>
  );
}
