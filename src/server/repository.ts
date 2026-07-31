import type { Capture, CaptureTag, OtpVerification, Project, Report, ReportRange, User } from "./types";

/**
 * Storage boundary. `MockRepository` (in-memory) is the default so the app
 * runs and is demoable with zero external setup. `PrismaRepository` is the
 * real implementation, activated automatically once DATABASE_URL is set
 * (see src/server/db.ts) — swap-in requires no call-site changes.
 */
export interface Repository {
  // Users
  createUser(input: { email: string; passwordHash: string | null; name: string }): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getUserByWhatsappNumber(phoneNumber: string): Promise<User | null>;
  setUserWhatsappVerified(userId: string, phoneNumber: string): Promise<User>;

  // OTP
  createOtp(input: { userId: string; phoneNumber: string; codeHash: string; expiresAt: string }): Promise<OtpVerification>;
  getLatestOtp(userId: string, phoneNumber: string): Promise<OtpVerification | null>;
  markOtpVerified(id: string): Promise<void>;

  // Projects
  createProject(input: { userId: string; name: string; client: string }): Promise<Project>;
  listProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  linkWhatsappGroup(projectId: string, waGroupId: string): Promise<void>;
  getProjectByWhatsappGroup(waGroupId: string): Promise<Project | null>;

  /**
   * DM messages carry no inherent project context (unlike a project-linked
   * group). MVP simplification: a `/proyek <nama>` command in a DM sets
   * "which project am I talking about" for that user until changed again.
   * Not in the Bagian 7 schema sketch — flagged there as a gap; this is the
   * pragmatic fill until a real product decision replaces it.
   */
  setActiveProjectForUser(userId: string, projectId: string): Promise<void>;
  getActiveProjectForUser(userId: string): Promise<Project | null>;

  // Captures
  addCapture(input: {
    projectId: string;
    kind: Capture["kind"];
    mediaUrl: string | null;
    mediaLabel: string | null;
    mediaTone: number | null;
    text: string;
    tag: CaptureTag;
    source: Capture["source"];
    waMessageId: string | null;
  }): Promise<Capture>;
  listCaptures(projectId: string): Promise<Capture[]>;
  markCapturesSeen(projectId: string): Promise<void>;
  countUnseenCaptures(projectId: string): Promise<number>;

  // Reports
  createReport(input: {
    projectId: string;
    title: string;
    summary: string;
    range: ReportRange;
    items: Report["items"];
  }): Promise<Report>;
  getReport(id: string): Promise<Report | null>;
  updateReport(id: string, patch: Partial<Pick<Report, "title" | "summary" | "items" | "sharedAt">>): Promise<Report>;

  // Search — full-text-ish scan across a user's captures; the AI layer
  // (src/server/ai.ts) reranks/synthesizes on top of these candidates.
  searchCaptures(userId: string, projectFilter: string | null): Promise<Array<Capture & { projectName: string }>>;
}
