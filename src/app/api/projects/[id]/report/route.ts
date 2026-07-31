import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";
import { getAiService } from "@/server/ai";
import type { ReportRange } from "@/server/types";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { id } = await params;
  const repo = getRepository();
  const project = await repo.getProject(id);
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const range: ReportRange = body?.range === "all" ? "all" : "week";

  const allCaptures = await repo.listCaptures(id);
  const cutoff = Date.now() - 7 * 86_400_000;
  const inRange = range === "all" ? allCaptures : allCaptures.filter((c) => new Date(c.createdAt).getTime() >= cutoff);

  const ai = getAiService();
  const { title, summary } = await ai.summarizeReport({ projectName: project.name, captures: inRange });

  const items = inRange
    .filter((c) => c.kind === "photo")
    .map((c) => ({ captureId: c.id, photoLabel: c.mediaLabel ?? "", caption: c.text, tone: c.mediaTone ?? 0 }));

  const report = await repo.createReport({ projectId: id, title, summary, range, items });

  return NextResponse.json({
    report: {
      id: report.id,
      title: report.title,
      summary: report.summary,
      rangeLabel: `${project.name} · Rentang: ${range === "week" ? "7 hari terakhir" : "semua waktu"}`,
      items: report.items,
    },
  });
}
