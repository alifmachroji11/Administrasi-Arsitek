export type CaptureKind = "photo" | "voice" | "note";

export type Tag =
  | "Progres"
  | "Revisi"
  | "Perlu Tindak Lanjut"
  | "Material"
  | "Catatan Klien";

export interface Capture {
  id: string;
  kind: CaptureKind;
  tag: Tag;
  daysAgo: number;
  timeLabel: string;
  text: string;
  photoLabel?: string;
  photoTone?: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  lastUpdate: string;
  newCount: number;
  summary: string;
  thumbTone: number;
  captures: Capture[];
}

export type ReportRange = "week" | "all";

export interface ReportItem {
  id: string;
  photoLabel: string;
  caption: string;
  tone: number;
}
