"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { ProjectDetail } from "@/screens/ProjectDetail";
import { BottomNav } from "@/components/BottomNav";
import type { Project, ReportRange, Tag } from "@/lib/types";

interface ApiCapture {
  id: string;
  kind: "photo" | "voice" | "text";
  tag: Tag;
  text: string;
  photoLabel: string | null;
  photoTone: number | null;
  timeLabel: string;
  daysAgo: number;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reportRange, setReportRange] = useState<ReportRange>("week");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          setProject(null);
          return;
        }
        const captures = (data.captures as ApiCapture[]).map((c) => ({
          id: c.id,
          kind: c.kind === "text" ? ("note" as const) : c.kind,
          tag: c.tag,
          daysAgo: c.daysAgo,
          timeLabel: c.timeLabel,
          text: c.text,
          photoLabel: c.photoLabel ?? undefined,
          photoTone: c.photoTone ?? undefined,
        }));
        setProject({
          id: data.project.id,
          name: data.project.name,
          client: data.project.client,
          lastUpdate: captures[0]?.timeLabel ?? "",
          newCount: 0,
          summary: "",
          thumbTone: captures[0]?.photoTone ?? 0,
          captures,
        });
        fetch(`/api/projects/${id}/seen`, { method: "POST" });
      });
  }, [id]);

  const buildReport = async () => {
    const res = await fetch(`/api/projects/${id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ range: reportRange }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/projects/${id}/report?reportId=${data.report.id}`);
  };

  return (
    <div className="page-transition flex h-dvh flex-col overflow-hidden" style={{ background: "var(--color-paper-dim)" }}>
      <div className="min-h-0 flex-1">
        <ProjectDetail
          project={project ?? null}
          activeTag={activeTag}
          expandedId={expandedId}
          reportRange={reportRange}
          onBack={() => router.push("/projects")}
          onToggleTag={setActiveTag}
          onToggleExpand={(cid) => setExpandedId((cur) => (cur === cid ? null : cid))}
          onSetRange={setReportRange}
          onBuildReport={buildReport}
        />
      </div>
      <BottomNav
        active="proyek"
        onProyek={() => router.push("/projects")}
        onCari={() => router.push("/search")}
        onProfil={() => router.push("/profil")}
      />
    </div>
  );
}
