import { useEffect, useMemo, useRef, useState } from "react";
import type { Project, ReportItem, ReportRange, Screen, Tag } from "./lib/types";
import { SEEDS } from "./data/seed";
import { Home } from "./screens/Home";
import { ProjectDetail } from "./screens/ProjectDetail";
import { ReportDraft } from "./screens/ReportDraft";
import { Onboarding } from "./screens/Onboarding";
import { ProfilPlaceholder } from "./screens/ProfilPlaceholder";
import { BottomNav, type NavSection } from "./components/BottomNav";
import { Toast } from "./components/Toast";
import { IngatShell } from "./ingat/IngatShell";

const DESKTOP_BREAKPOINT = 900;

export default function App() {
  const [section, setSection] = useState<NavSection>("proyek");
  const [screen, setScreen] = useState<Screen>("beranda");
  const [projects, setProjects] = useState<Project[]>([]);
  const [nextSeedIndex, setNextSeedIndex] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reportRange, setReportRange] = useState<ReportRange>("week");
  const [reportTitle, setReportTitle] = useState("");
  const [reportSummary, setReportSummary] = useState("");
  const [reportRangeLabel, setReportRangeLabel] = useState("");
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : false,
  );

  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flashToast = (message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const openOnboarding = () => setScreen("onboarding");
  const closeOnboarding = () => setScreen("beranda");

  const finishOnboarding = () => {
    const seed = SEEDS[nextSeedIndex % SEEDS.length];
    const project: Project = { ...seed, id: `p${Date.now()}`, captures: seed.captures.map((c) => ({ ...c })) };
    setProjects((prev) => [...prev, project]);
    setNextSeedIndex((i) => i + 1);
    setScreen("beranda");
    flashToast(`Nomor terhubung — proyek "${project.name}" dibuat`);
  };

  const openProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveTag(null);
    setExpandedId(null);
    setScreen("detail");
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, newCount: 0 } : p)));
  };

  const backFromDetail = () => setScreen("beranda");

  const buildReport = () => {
    if (!selectedProject) return;
    const week = reportRange === "week";
    const filtered = selectedProject.captures.filter((c) => !week || c.daysAgo <= 7);
    const photos: ReportItem[] = filtered
      .filter((c) => c.kind === "photo")
      .map((c) => ({ id: c.id, photoLabel: c.photoLabel ?? "", caption: c.text, tone: c.photoTone ?? 0 }));

    setReportTitle(`Laporan Progres — ${selectedProject.name}`);
    setReportSummary(selectedProject.summary);
    setReportRangeLabel(`${selectedProject.name} · Rentang: ${week ? "7 hari terakhir" : "semua waktu"}`);
    setReportItems(photos);
    setScreen("laporan");
  };

  const backFromReport = () => setScreen("detail");

  const updateCaption = (id: string, value: string) => {
    setReportItems((prev) => prev.map((it) => (it.id === id ? { ...it, caption: value } : it)));
  };

  const goProyek = () => {
    if (section === "proyek") setScreen("beranda");
    setSection("proyek");
  };
  const goCari = () => setSection("cari");
  const goProfil = () => setSection("profil");

  const showMain = section === "proyek" && (screen === "beranda" || screen === "detail");
  const showListPane = isDesktop || screen === "beranda";
  const showDetailPane = isDesktop || screen === "detail";

  return (
    <div className="h-dvh overflow-hidden" style={{ background: "var(--color-paper)" }}>
      {section === "proyek" && screen === "onboarding" && (
        <div className="h-full overflow-y-auto">
          <Onboarding onClose={closeOnboarding} onFinish={finishOnboarding} />
        </div>
      )}

      {section === "proyek" && screen === "laporan" && (
        <div className="h-full overflow-y-auto">
          <ReportDraft
            title={reportTitle}
            rangeLabel={reportRangeLabel}
            summary={reportSummary}
            items={reportItems}
            onBack={backFromReport}
            onTitleChange={setReportTitle}
            onSummaryChange={setReportSummary}
            onCaptionChange={updateCaption}
            onSave={() => flashToast("Draf laporan tersimpan")}
            onShare={() => flashToast("Tautan laporan siap — dibagikan ke klien lewat WhatsApp")}
          />
        </div>
      )}

      {showMain && (
        <div
          className={isDesktop ? "grid h-full" : "flex h-full flex-col"}
          style={{ gridTemplateColumns: isDesktop ? "380px 1fr" : undefined }}
        >
          {showListPane && (
            <div
              className="flex h-full min-h-0 flex-col"
              style={{
                borderRight: isDesktop ? "1px solid var(--color-stone-line)" : undefined,
                background: "var(--color-paper)",
              }}
            >
              <div className="min-h-0 flex-1">
                <Home
                  projects={projects}
                  selectedId={selectedProjectId}
                  isDesktop={isDesktop}
                  onOpen={openProject}
                  onConnect={openOnboarding}
                />
              </div>
              <BottomNav active="proyek" onProyek={goProyek} onCari={goCari} onProfil={goProfil} />
            </div>
          )}

          {showDetailPane && (
            <div className="flex h-full min-h-0 flex-col" style={{ background: "var(--color-paper-dim)" }}>
              <ProjectDetail
                project={selectedProject}
                activeTag={activeTag}
                expandedId={expandedId}
                reportRange={reportRange}
                onBack={backFromDetail}
                onToggleTag={setActiveTag}
                onToggleExpand={(id) => setExpandedId((cur) => (cur === id ? null : id))}
                onSetRange={setReportRange}
                onBuildReport={buildReport}
              />
            </div>
          )}
        </div>
      )}

      {section === "cari" && (
        <div className="flex h-full flex-col">
          <div className="min-h-0 flex-1">
            <IngatShell />
          </div>
          <BottomNav active="cari" onProyek={goProyek} onCari={goCari} onProfil={goProfil} />
        </div>
      )}

      {section === "profil" && (
        <div className="flex h-full flex-col">
          <ProfilPlaceholder />
          <BottomNav active="profil" onProyek={goProyek} onCari={goCari} onProfil={goProfil} />
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
