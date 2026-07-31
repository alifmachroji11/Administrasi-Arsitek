"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ReportDraft } from "@/screens/ReportDraft";
import { Toast } from "@/components/Toast";
import type { ReportItem } from "@/lib/types";

function ReportPageInner() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const reportId = search.get("reportId");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [rangeLabel, setRangeLabel] = useState("");
  const [items, setItems] = useState<ReportItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    fetch(`/api/reports/${reportId}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.report.title);
        setSummary(data.report.summary);
        setRangeLabel(data.rangeLabel);
        setItems(
          data.report.items.map((it: { captureId: string; photoLabel: string; caption: string; tone: number }) => ({
            id: it.captureId,
            photoLabel: it.photoLabel,
            caption: it.caption,
            tone: it.tone,
          })),
        );
      });
  }, [reportId]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  const persist = useCallback(
    async (patch: Record<string, unknown>) => {
      if (!reportId) return;
      await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    },
    [reportId],
  );

  const onSave = async () => {
    await persist({
      title,
      summary,
      items: items.map((it) => ({ captureId: it.id, photoLabel: it.photoLabel, caption: it.caption, tone: it.tone })),
    });
    flash("Draf laporan tersimpan");
  };

  const onShare = async () => {
    await onSave();
    if (!reportId) return;
    const res = await fetch(`/api/reports/${reportId}/share`, { method: "POST" });
    if (res.ok) flash("Tautan laporan siap — dibagikan ke klien lewat WhatsApp");
  };

  return (
    <div className="h-dvh overflow-y-auto" style={{ background: "var(--color-paper)" }}>
      <ReportDraft
        title={title}
        rangeLabel={rangeLabel}
        summary={summary}
        items={items}
        onBack={() => router.push(`/projects/${params.id}`)}
        onTitleChange={setTitle}
        onSummaryChange={setSummary}
        onCaptionChange={(id, v) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, caption: v } : it)))}
        onSave={onSave}
        onShare={onShare}
      />
      <Toast message={toast} />
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportPageInner />
    </Suspense>
  );
}
