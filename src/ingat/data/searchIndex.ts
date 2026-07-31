import type { ConnectedSource } from "../lib/types";

/**
 * Connected-sources status shown on the Ingat settings screen. Not backed
 * by a real integration yet — WhatsApp capture ingestion is live (see
 * src/app/api/webhook/whatsapp), but Drive and device gallery sync are
 * out of MVP scope (Bagian 2 doesn't include them), so this list stays
 * static/mock. TODO: replace with a real per-user connections table once
 * those integrations exist.
 */
export const CONNECTED_SOURCES: ConnectedSource[] = [
  {
    kind: "whatsapp",
    name: "WhatsApp",
    description: "Pesan yang diforward ke bot Notula per proyek",
    connected: true,
    lastSync: "Tersambung",
  },
  {
    kind: "drive",
    name: "Google Drive",
    description: "Dokumen, RAB, dan kontrak per folder proyek",
    connected: false,
    lastSync: "Belum tersedia",
  },
  {
    kind: "gallery",
    name: "Galeri Foto",
    description: "Foto lapangan yang tersimpan di perangkat",
    connected: false,
    lastSync: "Belum tersedia",
  },
];
