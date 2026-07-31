import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const { id } = await params;
  const repo = getRepository();
  const project = await repo.getProject(id);
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  }

  await repo.markCapturesSeen(id);
  return NextResponse.json({ ok: true });
}
