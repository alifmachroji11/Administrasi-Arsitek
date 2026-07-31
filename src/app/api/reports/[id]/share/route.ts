import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";

/**
 * "Bagikan ke Klien" — marks the report shared and returns a link.
 * TODO: real PDF export + an actual WhatsApp send-back needs a
 * Meta-approved message template (business-initiated messages can't be
 * freeform — see Bagian 5 of the product brief), so that part stays a
 * link handoff for now rather than an unapproved template call.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const updated = await repo.updateReport(id, { sharedAt: new Date().toISOString() });
  return NextResponse.json({ report: updated, shareUrl: `/laporan/${updated.id}` });
}
