import type { ConnectedSource, SearchEntry } from "../lib/types";

export const SEARCH_INDEX: SearchEntry[] = [
  {
    id: "q1",
    keywords: ["keramik", "lantai", "ruang tamu", "widya", "nat"],
    answer:
      "Keramik lantai ruang tamu di Renovasi Rumah Bu Widya sudah terpasang sekitar 70%, motifnya sesuai RAB awal. Untuk nat, tukang memakai warna abu-abu tua karena stok yang senada tinggal sedikit — dua dus disisakan untuk sample klien.",
    sourceIds: ["s1", "s2"],
  },
  {
    id: "q2",
    keywords: ["cat", "eksterior", "warna", "pagar", "dinding", "widya"],
    answer:
      "Klien memilih opsi B, krem hangat, untuk cat eksterior Rumah Bu Widya — sudah dites langsung di dinding pagar dan disetujui.",
    sourceIds: ["s3", "s4"],
  },
  {
    id: "q3",
    keywords: ["lampu", "kopi ranting", "kasir", "suhu warna", "2700", "kuning"],
    answer:
      "Untuk Kopi Ranting, klien minta warna lampu gantung area kasir diganti ke kuning hangat (2700K), menggantikan spesifikasi awal yang 4000K.",
    sourceIds: ["s5"],
  },
  {
    id: "q4",
    keywords: ["plafon", "outdoor", "graniti", "jadwal", "telat", "kopi ranting"],
    answer:
      "Plafon graniti untuk area outdoor Kopi Ranting tertunda sekitar 3 hari dari jadwal karena masih menunggu kedatangan material dari supplier.",
    sourceIds: ["s6", "s7"],
  },
  {
    id: "q5",
    keywords: ["kabel data", "it", "instalasi", "anara", "meeting"],
    answer:
      "Titik kabel data di Kantor Anara Studio belum dikonfirmasi tim IT klien. Ini perlu ditindaklanjuti supaya partisi ruang meeting yang sudah selesai dipasang tidak perlu dibongkar ulang untuk jalur kabel.",
    sourceIds: ["s8", "s10"],
  },
  {
    id: "q6",
    keywords: ["kontrak", "anara", "dokumen", "pdf"],
    answer:
      "Kontrak kerja untuk Kantor Sewa Anara Studio ada di Drive, terakhir diubah 20 Juli — dokumen PDF dengan Anara Design Co. sebagai pihak klien.",
    sourceIds: ["s9"],
  },
  {
    id: "q7",
    keywords: ["rab", "anggaran", "widya", "spreadsheet"],
    answer:
      "RAB Revisi 2 untuk Rumah Bu Widya ada di Drive, terakhir diubah 25 Juli. Ini yang jadi acuan motif keramik ruang tamu yang sedang dipasang.",
    sourceIds: ["s4", "s1"],
  },
  {
    id: "q8",
    keywords: ["lantai vinyl", "sample lantai", "kopi ranting", "duduk"],
    answer:
      "Sample lantai vinyl motif kayu untuk area duduk Kopi Ranting sudah datang di lokasi tiga hari lalu, dan masih menunggu approval klien.",
    sourceIds: ["s7"],
  },
];

export const CONNECTED_SOURCES: ConnectedSource[] = [
  {
    kind: "whatsapp",
    name: "WhatsApp",
    description: "Pesan yang diforward ke bot Notula per proyek",
    connected: true,
    lastSync: "Disinkronkan 4 menit lalu",
  },
  {
    kind: "drive",
    name: "Google Drive",
    description: "Dokumen, RAB, dan kontrak per folder proyek",
    connected: true,
    lastSync: "Disinkronkan 1 jam lalu",
  },
  {
    kind: "gallery",
    name: "Galeri Foto",
    description: "Foto lapangan yang tersimpan di perangkat",
    connected: false,
    lastSync: "Belum pernah disinkronkan",
  },
];

export const PROJECT_CHIPS = ["Renovasi Rumah Bu Widya", "Fit-Out Kopi Ranting", "Kantor Sewa Anara Studio"];

export const RECENT_SEARCHES = [
  "warna cat eksterior rumah bu widya",
  "kapan plafon graniti kopi ranting selesai",
  "kontrak anara studio",
];

export const EXAMPLE_QUERIES = [
  "Coba tanya: \"keramik apa yang dipakai di ruang tamu Bu Widya?\"",
  "Coba tanya: \"warna lampu yang diminta klien Kopi Ranting?\"",
  "Coba tanya: \"kenapa plafon outdoor kopi ranting telat?\"",
  "Coba tanya: \"di mana kontrak Anara Studio?\"",
];
