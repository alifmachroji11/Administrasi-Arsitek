import type { Capture, CaptureTag } from "./types";

/**
 * AI layer — classification, report summarization, and search synthesis
 * behind one interface. MockAiService (active by default) uses plain
 * heuristics so every flow is demoable without an API key. ClaudeAiService
 * activates once ANTHROPIC_API_KEY + ANTHROPIC_MODEL are set — calls the
 * Messages API directly over fetch (no SDK dependency) so it's easy to
 * audit. Untested against a live key in this build; verify the model ID
 * against current Anthropic docs before relying on it (deliberately not
 * hardcoded — a stale guess is worse than an explicit env var).
 */
export interface AiService {
  classifyCapture(input: { text: string; kind: Capture["kind"] }): Promise<{ tag: CaptureTag }>;
  summarizeReport(input: { projectName: string; captures: Capture[] }): Promise<{ title: string; summary: string }>;
  synthesizeSearchAnswer(input: {
    query: string;
    candidates: Array<Capture & { projectName: string }>;
  }): Promise<{ answer: string; sourceIds: string[] } | null>;
}

const TAG_KEYWORDS: Record<CaptureTag, string[]> = {
  Revisi: ["revisi", "ganti", "ubah", "geser", "diganti", "minta diubah"],
  "Perlu Tindak Lanjut": ["nanya", "tanya", "mohon", "belum", "tunggu", "konfirmasi", "follow up", "tolong"],
  Material: ["sample", "material", "cat", "keramik", "kayu", "vinyl", "graniti"],
  "Catatan Klien": ["klien setuju", "klien approve", "site meeting", "klien minta", "disetujui klien"],
  Progres: ["selesai", "terpasang", "progres", "sudah", "rampung", "dipasang"],
};

class MockAiService implements AiService {
  async classifyCapture({ text }: { text: string; kind: Capture["kind"] }) {
    const lower = text.toLowerCase();
    let best: CaptureTag = "Progres";
    let bestScore = 0;
    for (const [tag, keywords] of Object.entries(TAG_KEYWORDS) as Array<[CaptureTag, string[]]>) {
      const score = keywords.filter((kw) => lower.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        best = tag;
      }
    }
    return { tag: best };
  }

  async summarizeReport({ projectName, captures }: { projectName: string; captures: Capture[] }) {
    const byTag = new Map<CaptureTag, number>();
    for (const c of captures) byTag.set(c.tag, (byTag.get(c.tag) ?? 0) + 1);

    const parts: string[] = [];
    const progres = captures.filter((c) => c.tag === "Progres");
    if (progres.length) parts.push(`Progres tercatat: ${progres.map((c) => c.text).slice(0, 2).join(" ")}`);
    const revisi = captures.filter((c) => c.tag === "Revisi");
    if (revisi.length) parts.push(`Ada ${revisi.length} permintaan revisi, salah satunya: ${revisi[0].text}`);
    const tindak = captures.filter((c) => c.tag === "Perlu Tindak Lanjut");
    if (tindak.length) parts.push(`Masih menunggu tindak lanjut untuk: ${tindak[0].text}`);

    return {
      title: `Laporan Progres — ${projectName}`,
      summary: parts.length ? parts.join(" ") : "Belum ada tangkapan pada rentang ini.",
    };
  }

  async synthesizeSearchAnswer({ query, candidates }: { query: string; candidates: Array<Capture & { projectName: string }> }) {
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    const scored = candidates
      .map((c) => ({ c, score: words.filter((w) => c.text.toLowerCase().includes(w)).length }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) return null;

    const top = scored.slice(0, 3).map((s) => s.c);
    const answer = top.map((c) => c.text).join(" ");
    return { answer, sourceIds: top.map((c) => c.id) };
  }
}

class ClaudeAiService implements AiService {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  private async complete(prompt: string): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text().catch(() => "")}`);
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    return data.content?.[0]?.text?.trim() ?? "";
  }

  async classifyCapture({ text, kind }: { text: string; kind: Capture["kind"] }) {
    const tags: CaptureTag[] = ["Progres", "Revisi", "Perlu Tindak Lanjut", "Material", "Catatan Klien"];
    const raw = await this.complete(
      `Klasifikasikan pesan proyek arsitektur berikut (jenis: ${kind}) ke SATU tag dari daftar ini: ${tags.join(", ")}.\n` +
        `Balas hanya dengan nama tag persis seperti di daftar, tanpa penjelasan.\n\nPesan: "${text}"`,
    );
    const match = tags.find((t) => raw.includes(t));
    return { tag: match ?? "Progres" };
  }

  async summarizeReport({ projectName, captures }: { projectName: string; captures: Capture[] }) {
    const bullets = captures.map((c) => `- [${c.tag}] ${c.text}`).join("\n");
    const summary = await this.complete(
      `Tulis ringkasan progres 3-5 kalimat untuk laporan proyek arsitektur "${projectName}", ` +
        `dalam Bahasa Indonesia yang natural dan hangat (bukan bahasa korporat kaku), berdasarkan catatan berikut:\n\n${bullets}`,
    );
    return { title: `Laporan Progres — ${projectName}`, summary };
  }

  async synthesizeSearchAnswer({ query, candidates }: { query: string; candidates: Array<Capture & { projectName: string }> }) {
    if (candidates.length === 0) return null;
    const context = candidates
      .slice(0, 12)
      .map((c) => `[${c.id}] (${c.projectName}) ${c.text}`)
      .join("\n");
    const raw = await this.complete(
      `Pertanyaan pengguna: "${query}"\n\nSumber yang tersedia:\n${context}\n\n` +
        `Jawab pertanyaan dalam 1-3 kalimat Bahasa Indonesia yang natural, tenang, dan meyakinkan, hanya berdasarkan sumber di atas. ` +
        `Jika tidak ada sumber yang relevan, balas persis: TIDAK_DITEMUKAN. ` +
        `Di akhir jawaban, di baris baru, tulis "SUMBER:" diikuti id sumber yang dipakai dipisah koma (contoh: SUMBER: cap_1,cap_2).`,
    );
    if (raw.includes("TIDAK_DITEMUKAN")) return null;

    const [answerPart, sourcePart] = raw.split(/SUMBER:/i);
    const sourceIds = (sourcePart ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { answer: answerPart.trim(), sourceIds: sourceIds.length ? sourceIds : candidates.slice(0, 2).map((c) => c.id) };
  }
}

export function getAiService(): AiService {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  if (apiKey && model) return new ClaudeAiService(apiKey, model);
  return new MockAiService();
}
