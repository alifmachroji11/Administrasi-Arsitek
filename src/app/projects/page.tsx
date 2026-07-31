"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { BottomNav } from "@/components/BottomNav";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState } from "@/screens/EmptyState";

interface ProjectListItem {
  id: string;
  name: string;
  client: string;
  newCount: number;
  lastUpdate: string;
  thumbTone: number;
  thumbLabel: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectListItem[] | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []));
  }, []);

  if (projects === null) {
    return (
      <div className="flex h-dvh items-center justify-center" style={{ background: "var(--color-paper)" }}>
        <p className="text-[13.5px]" style={{ color: "var(--color-ink-faint)" }}>
          Memuat…
        </p>
      </div>
    );
  }

  return (
    <div className="page-transition flex h-dvh flex-col overflow-hidden" style={{ background: "var(--color-paper)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <span className="font-display text-[22px] font-semibold" style={{ color: "var(--color-ink)" }}>
          Notula
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[12.5px] font-medium"
          style={{ color: "var(--color-ink-faint)" }}
        >
          Keluar
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState onConnect={() => router.push("/onboarding")} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-4">
          <div className="flex flex-col gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={{
                  id: p.id,
                  name: p.name,
                  client: p.client,
                  newCount: p.newCount,
                  lastUpdate: p.lastUpdate,
                  thumbTone: p.thumbTone,
                  summary: "",
                  captures: p.thumbLabel ? [{ id: "x", kind: "photo", tag: "Progres", daysAgo: 0, timeLabel: "", text: "", photoLabel: p.thumbLabel, photoTone: p.thumbTone }] : [],
                }}
                onOpen={() => router.push(`/projects/${p.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div
          className="px-5 pt-4 pb-4"
          style={{ background: "linear-gradient(180deg, rgba(247,241,230,0), var(--color-paper) 40%)" }}
        >
          <button
            onClick={() => router.push("/onboarding")}
            className="w-full rounded-2xl px-6 py-4 text-[14.5px] font-semibold text-[#fdf6ea] transition-transform active:scale-[0.98]"
            style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-float)" }}
          >
            + Hubungkan Nomor WhatsApp Baru
          </button>
        </div>
      )}

      <BottomNav
        active="proyek"
        onProyek={() => router.push("/projects")}
        onCari={() => router.push("/search")}
        onProfil={() => router.push("/profil")}
      />
    </div>
  );
}
