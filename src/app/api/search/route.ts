import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";
import { getAiService } from "@/server/ai";
import { timeAgo, dateLabel } from "@/server/format";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const url = new URL(req.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const projectFilter = url.searchParams.get("project");
  if (!query) return NextResponse.json({ answer: null, sources: [] });

  const repo = getRepository();
  const candidates = await repo.searchCaptures(session.user.id, projectFilter);

  const ai = getAiService();
  const result = await ai.synthesizeSearchAnswer({ query, candidates });

  if (!result) return NextResponse.json({ answer: null, sources: [] });

  const sourceMap = new Map(candidates.map((c) => [c.id, c]));
  const sources = result.sourceIds
    .map((id) => sourceMap.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      id: c.id,
      kind: c.kind === "photo" ? ("photo" as const) : ("chat" as const),
      project: c.projectName,
      dateLabel: `${timeAgo(c.createdAt)} · ${dateLabel(c.createdAt)}`,
      snippet: c.text,
      photoLabel: c.mediaLabel ?? undefined,
      photoTone: c.mediaTone ?? undefined,
    }));

  return NextResponse.json({ answer: result.answer, sources });
}
