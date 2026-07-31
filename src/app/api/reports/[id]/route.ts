import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { id } = await params;
  const repo = getRepository();
  const report = await repo.getReport(id);
  if (!report) return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });

  const project = await repo.getProject(report.projectId);
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    report,
    rangeLabel: `${project.name} · Rentang: ${report.range === "week" ? "7 hari terakhir" : "semua waktu"}`,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { id } = await params;
  const repo = getRepository();
  const report = await repo.getReport(id);
  if (!report) return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });

  const project = await repo.getProject(report.projectId);
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const patch: Parameters<typeof repo.updateReport>[1] = {};
  if (typeof body?.title === "string") patch.title = body.title;
  if (typeof body?.summary === "string") patch.summary = body.summary;
  if (Array.isArray(body?.items)) patch.items = body.items;

  const updated = await repo.updateReport(id, patch);
  return NextResponse.json({ report: updated });
}
