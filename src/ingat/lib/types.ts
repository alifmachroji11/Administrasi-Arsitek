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

export type ConnectedSourceKind = "whatsapp" | "drive" | "gallery";

export interface ConnectedSource {
  kind: ConnectedSourceKind;
  name: string;
  description: string;
  connected: boolean;
  lastSync: string;
}

export type IngatScreen = "home" | "results" | "detail" | "settings";
