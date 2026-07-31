import type { Tag } from "./types";

export const TAG_LIST: Tag[] = [
  "Progres",
  "Revisi",
  "Perlu Tindak Lanjut",
  "Material",
  "Catatan Klien",
];

export const TAG_META: Record<Tag, { fg: string; bg: string }> = {
  Progres: { fg: "var(--color-tag-progres)", bg: "var(--color-tag-progres-bg)" },
  Revisi: { fg: "var(--color-tag-revisi)", bg: "var(--color-tag-revisi-bg)" },
  "Perlu Tindak Lanjut": { fg: "var(--color-tag-tindak)", bg: "var(--color-tag-tindak-bg)" },
  Material: { fg: "var(--color-tag-material)", bg: "var(--color-tag-material-bg)" },
  "Catatan Klien": { fg: "var(--color-tag-klien)", bg: "var(--color-tag-klien-bg)" },
};
