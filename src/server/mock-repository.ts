import type { Repository } from "./repository";
import type { Capture, CaptureTag, OtpVerification, Project, Report, ReportRange, User } from "./types";

/**
 * In-memory implementation — the active repository until DATABASE_URL is
 * set (see db.ts). Data resets on server restart; that's expected for a
 * prototype and is the whole point of putting this behind an interface.
 * Cached on globalThis so Next.js dev's module hot-reload doesn't wipe it
 * on every request.
 */
class MockRepository implements Repository {
  users = new Map<string, User>();
  projects = new Map<string, Project>();
  groups = new Map<string, string>(); // waGroupId -> projectId
  captures = new Map<string, Capture>();
  reports = new Map<string, Report>();
  otps = new Map<string, OtpVerification>();
  seenAt = new Map<string, string>(); // projectId -> ISO timestamp of last "viewed"
  activeProject = new Map<string, string>(); // userId -> projectId, set via "/proyek <nama>" in DM

  private id(prefix: string) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
  }

  async createUser(input: { email: string; passwordHash: string | null; name: string }): Promise<User> {
    const user: User = {
      id: this.id("user"),
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      name: input.name,
      whatsappVerifiedNumber: null,
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByEmail(email: string) {
    const target = email.toLowerCase();
    return [...this.users.values()].find((u) => u.email === target) ?? null;
  }

  async getUserById(id: string) {
    return this.users.get(id) ?? null;
  }

  async getUserByWhatsappNumber(phoneNumber: string) {
    return [...this.users.values()].find((u) => u.whatsappVerifiedNumber === phoneNumber) ?? null;
  }

  async setUserWhatsappVerified(userId: string, phoneNumber: string) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    const updated = { ...user, whatsappVerifiedNumber: phoneNumber };
    this.users.set(userId, updated);
    return updated;
  }

  async createOtp(input: { userId: string; phoneNumber: string; codeHash: string; expiresAt: string }) {
    const otp: OtpVerification = { id: this.id("otp"), verifiedAt: null, ...input };
    this.otps.set(otp.id, otp);
    return otp;
  }

  async getLatestOtp(userId: string, phoneNumber: string) {
    const candidates = [...this.otps.values()]
      .filter((o) => o.userId === userId && o.phoneNumber === phoneNumber)
      .sort((a, b) => b.expiresAt.localeCompare(a.expiresAt));
    return candidates[0] ?? null;
  }

  async markOtpVerified(id: string) {
    const otp = this.otps.get(id);
    if (otp) this.otps.set(id, { ...otp, verifiedAt: new Date().toISOString() });
  }

  async createProject(input: { userId: string; name: string; client: string }) {
    const project: Project = {
      id: this.id("proj"),
      userId: input.userId,
      name: input.name,
      client: input.client,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  async listProjects(userId: string) {
    return [...this.projects.values()]
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getProject(id: string) {
    return this.projects.get(id) ?? null;
  }

  async linkWhatsappGroup(projectId: string, waGroupId: string) {
    this.groups.set(waGroupId, projectId);
  }

  async getProjectByWhatsappGroup(waGroupId: string) {
    const projectId = this.groups.get(waGroupId);
    return projectId ? (this.projects.get(projectId) ?? null) : null;
  }

  async setActiveProjectForUser(userId: string, projectId: string) {
    this.activeProject.set(userId, projectId);
  }

  async getActiveProjectForUser(userId: string) {
    const projectId = this.activeProject.get(userId);
    return projectId ? (this.projects.get(projectId) ?? null) : null;
  }

  async addCapture(input: {
    projectId: string;
    kind: Capture["kind"];
    mediaUrl: string | null;
    mediaLabel: string | null;
    mediaTone: number | null;
    text: string;
    tag: CaptureTag;
    source: Capture["source"];
    waMessageId: string | null;
  }) {
    const capture: Capture = { id: this.id("cap"), seenAt: null, createdAt: new Date().toISOString(), ...input };
    this.captures.set(capture.id, capture);
    return capture;
  }

  async listCaptures(projectId: string) {
    return [...this.captures.values()]
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async markCapturesSeen(projectId: string) {
    const now = new Date().toISOString();
    for (const c of this.captures.values()) {
      if (c.projectId === projectId && !c.seenAt) this.captures.set(c.id, { ...c, seenAt: now });
    }
  }

  async countUnseenCaptures(projectId: string) {
    return [...this.captures.values()].filter((c) => c.projectId === projectId && !c.seenAt).length;
  }

  async createReport(input: { projectId: string; title: string; summary: string; range: ReportRange; items: Report["items"] }) {
    const report: Report = { id: this.id("rep"), createdAt: new Date().toISOString(), sharedAt: null, ...input };
    this.reports.set(report.id, report);
    return report;
  }

  async getReport(id: string) {
    return this.reports.get(id) ?? null;
  }

  async updateReport(id: string, patch: Partial<Pick<Report, "title" | "summary" | "items" | "sharedAt">>) {
    const report = this.reports.get(id);
    if (!report) throw new Error("Report not found");
    const updated = { ...report, ...patch };
    this.reports.set(id, updated);
    return updated;
  }

  async searchCaptures(userId: string, projectFilter: string | null) {
    const projectIds = new Set([...this.projects.values()].filter((p) => p.userId === userId).map((p) => p.id));
    return [...this.captures.values()]
      .filter((c) => projectIds.has(c.projectId))
      .filter((c) => !projectFilter || this.projects.get(c.projectId)?.name === projectFilter)
      .map((c) => ({ ...c, projectName: this.projects.get(c.projectId)?.name ?? "" }));
  }
}

function seed(repo: MockRepository) {
  const user: User = {
    id: "user_demo",
    email: "demo@notula.app",
    passwordHash: null,
    name: "Arsitek Demo",
    whatsappVerifiedNumber: null,
    createdAt: new Date().toISOString(),
  };
  repo.users.set(user.id, user);

  const days = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

  const projectSeeds: Array<{
    name: string;
    client: string;
    summary: string;
    captures: Array<Omit<Capture, "id" | "projectId" | "createdAt" | "seenAt"> & { daysAgo: number }>;
  }> = [
    {
      name: "Renovasi Rumah Bu Widya",
      client: "Widya Kartika",
      summary:
        "Minggu ini progres berjalan baik: pemasangan keramik ruang tamu sudah 70% dan rangka plafon kamar utama rampung. Ada satu permintaan revisi dari klien soal posisi stop kontak, serta konfirmasi warna nat keramik yang masih menunggu jawaban.",
      captures: [
        { kind: "photo", tag: "Progres", daysAgo: 0, mediaLabel: "Ruang Tamu", mediaTone: 1, mediaUrl: null, text: "Keramik lantai ruang tamu terpasang sekitar 70%, motif sesuai RAB.", source: "dm", waMessageId: "wamid.a1" },
        { kind: "voice", tag: "Perlu Tindak Lanjut", daysAgo: 1, mediaLabel: null, mediaTone: null, mediaUrl: null, text: "Pak, tukang keramiknya nanya, nat keramiknya warna abu-abu tua apa senada aja? Stok yang senada tinggal dikit.", source: "dm", waMessageId: "wamid.a2" },
        { kind: "text", tag: "Revisi", daysAgo: 1, mediaLabel: null, mediaTone: null, mediaUrl: null, text: "Klien minta posisi stop kontak di kamar utama digeser 30 cm ke kiri dari gambar awal.", source: "group", waMessageId: "wamid.a3" },
        { kind: "photo", tag: "Progres", daysAgo: 3, mediaLabel: "Kamar Utama", mediaTone: 2, mediaUrl: null, text: "Rangka plafon kamar utama selesai dipasang, siap lanjut ke gypsum.", source: "dm", waMessageId: "wamid.a4" },
        { kind: "photo", tag: "Material", daysAgo: 4, mediaLabel: "Dinding Pagar", mediaTone: 3, mediaUrl: null, text: "Sample warna cat eksterior sudah dites di dinding pagar. Klien condong ke opsi B, krem hangat.", source: "dm", waMessageId: "wamid.a5" },
      ],
    },
    {
      name: "Fit-Out Kopi Ranting",
      client: "Studio Ranting Coffee",
      summary:
        "Fit-out area kasir maju pesat — rak kayu sudah terpasang dan tinggal finishing. Ada revisi kecil soal suhu warna lampu gantung, dan progres plafon outdoor sedikit tertunda menunggu material.",
      captures: [
        { kind: "photo", tag: "Progres", daysAgo: 0, mediaLabel: "Area Kasir", mediaTone: 3, mediaUrl: null, text: "Rak kayu dinding kasir selesai dipasang, tinggal finishing minyak kayu.", source: "group", waMessageId: "wamid.b1" },
        { kind: "text", tag: "Revisi", daysAgo: 1, mediaLabel: null, mediaTone: null, mediaUrl: null, text: "Klien minta warna lampu gantung diganti ke warna kuning hangat (2700K).", source: "group", waMessageId: "wamid.b2" },
        { kind: "voice", tag: "Perlu Tindak Lanjut", daysAgo: 2, mediaLabel: null, mediaTone: null, mediaUrl: null, text: "Plafon graniti buat area outdoor jadi nunggu barangnya, kira-kira telat 3 hari dari jadwal.", source: "group", waMessageId: "wamid.b3" },
      ],
    },
    {
      name: "Kantor Sewa Anara Studio",
      client: "Anara Design Co.",
      summary:
        "Pekerjaan partisi ruang meeting sudah selesai dan siap dicat. Instalasi kabel data tertunda menunggu konfirmasi titik akses dari tim IT klien.",
      captures: [
        { kind: "photo", tag: "Progres", daysAgo: 1, mediaLabel: "Ruang Meeting", mediaTone: 2, mediaUrl: null, text: "Partisi gypsum ruang meeting selesai dipasang, siap masuk tahap pengecatan.", source: "dm", waMessageId: "wamid.c1" },
        { kind: "voice", tag: "Perlu Tindak Lanjut", daysAgo: 2, mediaLabel: null, mediaTone: null, mediaUrl: null, text: "Titik kabel data belum dikonfirmasi tim IT klien, mohon ditanyakan supaya jalur instalasi tidak bongkar ulang.", source: "dm", waMessageId: "wamid.c2" },
      ],
    },
  ];

  for (const p of projectSeeds) {
    const project: Project = {
      id: `proj_${p.name.slice(0, 6).toLowerCase().replace(/\s+/g, "")}`,
      userId: user.id,
      name: p.name,
      client: p.client,
      status: "active",
      createdAt: days(30),
    };
    repo.projects.set(project.id, project);

    p.captures.forEach((c, i) => {
      const { daysAgo, ...rest } = c;
      const capture: Capture = {
        id: `${project.id}_cap${i}`,
        projectId: project.id,
        createdAt: days(daysAgo),
        seenAt: daysAgo > 1 ? days(daysAgo) : null,
        ...rest,
      };
      repo.captures.set(capture.id, capture);
    });
  }
}

declare global {
  var __notulaMockRepo: MockRepository | undefined;
}

export function getMockRepository(): Repository {
  if (!global.__notulaMockRepo) {
    global.__notulaMockRepo = new MockRepository();
    seed(global.__notulaMockRepo);
  }
  return global.__notulaMockRepo;
}
