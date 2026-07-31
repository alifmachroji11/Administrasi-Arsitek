import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";
import { timeAgo, dateLabel } from "@/server/format";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { id } = await params;
  const repo = getRepository();
  const project = await repo.getProject(id);
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  }

  const captures = await repo.listCaptures(project.id);

  return NextResponse.json({
    project: { id: project.id, name: project.name, client: project.client },
    captures: captures.map((c) => ({
      id: c.id,
      kind: c.kind,
      tag: c.tag,
      text: c.text,
      photoLabel: c.mediaLabel,
      photoTone: c.mediaTone,
      timeLabel: timeAgo(c.createdAt),
      dateLabel: dateLabel(c.createdAt),
      daysAgo: Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86_400_000),
    })),
  });
}
