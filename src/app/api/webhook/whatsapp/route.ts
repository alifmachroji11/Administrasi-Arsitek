import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRepository } from "@/server/db";
import { getAiService } from "@/server/ai";
import type { CaptureKind } from "@/server/types";

/**
 * Meta verification handshake — required once, when you register this URL
 * as the webhook in the Meta App dashboard.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "Verifikasi gagal." }, { status: 403 });
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true; // not configured — allow through in dev, but flag it
  if (!signatureHeader) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
}

interface WaMessage {
  from: string;
  id: string;
  type: string;
  text?: { body: string };
  image?: { caption?: string; id: string };
  audio?: { id: string };
  document?: { caption?: string; filename?: string; id: string };
}

function toE164(waId: string): string {
  return waId.startsWith("+") ? waId : `+${waId}`;
}

function extractText(msg: WaMessage): string {
  if (msg.type === "text") return msg.text?.body ?? "";
  if (msg.type === "image") return msg.image?.caption ?? "";
  if (msg.type === "document") return msg.document?.caption ?? msg.document?.filename ?? "";
  // Voice notes: Cloud API sends only a media id, no transcript. Real
  // speech-to-text isn't wired here — flagged as TODO below.
  return "";
}

function toCaptureKind(waType: string): CaptureKind {
  if (waType === "image") return "photo";
  if (waType === "audio") return "voice";
  return "text";
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature tidak valid." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const repo = getRepository();
  const ai = getAiService();

  const changes = payload?.entry?.flatMap((e: { changes?: unknown[] }) => e.changes ?? []) ?? [];

  for (const change of changes) {
    const messages: WaMessage[] = change?.value?.messages ?? [];

    for (const msg of messages) {
      const fromNumber = toE164(msg.from);
      const user = await repo.getUserByWhatsappNumber(fromNumber);

      if (!user) {
        // Sender hasn't linked/verified this number to a NotulArs account.
        // Per Bagian 5, group-member privacy is an open product decision —
        // deliberately dropping unlinked senders rather than guessing.
        console.warn(`[webhook] pesan dari nomor belum terverifikasi: ${fromNumber}`);
        continue;
      }

      let text = extractText(msg).trim();
      if (msg.type === "audio" && !text) {
        text = "(voice note — transkripsi belum tersedia, TODO: wire speech-to-text)";
      }

      const projectCommand = text.match(/^\/proyek\s+(.+)/i);
      if (projectCommand) {
        const name = projectCommand[1].trim();
        const existing = (await repo.listProjects(user.id)).find((p) => p.name.toLowerCase() === name.toLowerCase());
        const project = existing ?? (await repo.createProject({ userId: user.id, name, client: "—" }));
        await repo.setActiveProjectForUser(user.id, project.id);
        // NOTE: WhatsApp Business Cloud API's support for messages arriving
        // from user-created groups is not confirmed against current Meta
        // docs at time of writing — verify before relying on group-based
        // project routing in production. This command works identically
        // for DMs and (if the payload shape holds) groups.
        continue;
      }

      const project = await repo.getActiveProjectForUser(user.id);
      if (!project) {
        console.warn(`[webhook] tidak ada proyek aktif untuk user ${user.id}, pesan dilewati. Kirim "/proyek <nama>" dulu.`);
        continue;
      }

      const kind = toCaptureKind(msg.type);
      const { tag } = await ai.classifyCapture({ text, kind });

      await repo.addCapture({
        projectId: project.id,
        kind,
        mediaUrl: null, // TODO: fetch media via Cloud API /{media-id} and persist to object storage
        mediaLabel: kind === "photo" ? "Foto Lapangan" : null,
        mediaTone: kind === "photo" ? Math.floor(Math.random() * 4) : null,
        text: text || "(tidak ada teks)",
        tag,
        source: "dm",
        waMessageId: msg.id,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
