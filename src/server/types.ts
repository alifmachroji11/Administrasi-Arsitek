// Server-side domain model — mirrors the sketch in Bagian 7 of the product
// brief, with a couple of pragmatic additions (Project.client, Report.items)
// needed to actually render the screens. Adjust freely once real usage
// patterns emerge; this is a starting point, not a frozen schema.

export type CaptureKind = "photo" | "voice" | "text";
export type CaptureTag = "Progres" | "Revisi" | "Perlu Tindak Lanjut" | "Material" | "Catatan Klien";
export type CaptureSource = "dm" | "group";
export type ReportRange = "week" | "all";
export type ProjectStatus = "active" | "archived";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  whatsappVerifiedNumber: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  client: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectWhatsappGroup {
  id: string;
  projectId: string;
  waGroupId: string;
}

export interface Capture {
  id: string;
  projectId: string;
  kind: CaptureKind;
  mediaUrl: string | null;
  mediaLabel: string | null;
  mediaTone: number | null;
  text: string;
  tag: CaptureTag;
  source: CaptureSource;
  waMessageId: string | null;
  seenAt: string | null;
  createdAt: string;
}

export interface ReportItem {
  captureId: string;
  photoLabel: string;
  caption: string;
  tone: number;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  range: ReportRange;
  items: ReportItem[];
  createdAt: string;
  sharedAt: string | null;
}

export interface OtpVerification {
  id: string;
  userId: string;
  phoneNumber: string;
  codeHash: string;
  expiresAt: string;
  verifiedAt: string | null;
}
