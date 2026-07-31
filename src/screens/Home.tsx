import type { Project } from "../lib/types";
import { ProjectCard } from "../components/ProjectCard";
import { EmptyState } from "./EmptyState";

interface HomeProps {
  projects: Project[];
  selectedId: string | null;
  isDesktop: boolean;
  onOpen: (id: string) => void;
  onConnect: () => void;
}

export function Home({ projects, selectedId, isDesktop, onOpen, onConnect }: HomeProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-2">
        <span className="font-display text-[22px] font-semibold" style={{ color: "var(--color-ink)" }}>
          Notula
        </span>
      </div>

      {projects.length === 0 ? (
        <EmptyState onConnect={onConnect} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-4">
          <div className="flex flex-col gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} active={isDesktop && p.id === selectedId} onOpen={() => onOpen(p.id)} />
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div
          className="sticky bottom-0 px-5 pt-4 pb-4"
          style={{ background: "linear-gradient(180deg, rgba(247,241,230,0), var(--color-paper) 40%)" }}
        >
          <button
            onClick={onConnect}
            className="w-full rounded-2xl px-6 py-4 text-[14.5px] font-semibold text-[#fdf6ea] transition-transform active:scale-[0.98]"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            + Hubungkan Nomor WhatsApp Baru
          </button>
        </div>
      )}
    </div>
  );
}
