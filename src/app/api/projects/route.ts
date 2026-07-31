import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";
import { timeAgo } from "@/server/format";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const repo = getRepository();
  const projects = await repo.listProjects(session.user.id);

  const withMeta = await Promise.all(
    projects.map(async (p) => {
      const captures = await repo.listCaptures(p.id);
      const unseen = await repo.countUnseenCaptures(p.id);
      const latestPhoto = captures.find((c) => c.kind === "photo");
      return {
        id: p.id,
        name: p.name,
        client: p.client,
        newCount: unseen,
        lastUpdate: captures[0] ? timeAgo(captures[0].createdAt) : timeAgo(p.createdAt),
        thumbTone: latestPhoto?.mediaTone ?? 0,
        thumbLabel: latestPhoto?.mediaLabel ?? p.name.slice(0, 2),
      };
    }),
  );

  return NextResponse.json({ projects: withMeta });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  if (!session.user.email) return NextResponse.json({ error: "Sesi tidak lengkap." }, { status: 400 });

  const repo = getRepository();
  const me = await repo.getUserById(session.user.id);
  if (!me?.whatsappVerifiedNumber) {
    return NextResponse.json({ error: "Verifikasi nomor WhatsApp dulu sebelum membuat proyek." }, { status: 412 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const client = typeof body?.client === "string" ? body.client.trim() : "";
  if (!name) return NextResponse.json({ error: "Nama proyek wajib diisi." }, { status: 400 });

  const project = await repo.createProject({ userId: session.user.id, name, client: client || "—" });
  return NextResponse.json({ project });
}
