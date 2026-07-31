export type SourceKind = "chat" | "photo" | "drive";

export interface ChatMessage {
  fromMe: boolean;
  text: string;
  time: string;
}

export interface Source {
  id: string;
  kind: SourceKind;
  project: string;
  dateLabel: string;
  // chat
  snippet?: string;
  context?: ChatMessage[];
  // photo
  photoLabel?: string;
  photoTone?: number;
  // drive
  fileName?: string;
  fileType?: string;
  fileSize?: string;
}
