# Notula

Prototipe web app pendamping untuk Notula — asisten penangkap informasi
proyek arsitektur yang bekerja lewat WhatsApp. Arsitek forward foto lapangan,
voice note, atau catatan singkat ke bot WhatsApp per proyek; app ini adalah
tempat semua tangkapan itu tersusun rapi per proyek dan bisa diubah jadi
laporan siap kirim dengan sekali klik.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Mulai dari state kosong — klik "Hubungkan
Nomor WhatsApp Baru" untuk melalui alur onboarding dan membuat proyek contoh
(dua proyek seed tersedia, bergiliran setiap kali onboarding diselesaikan).

## Alur yang bisa dicoba

1. **Beranda** — daftar proyek, atau state kosong dengan instruksi 3 langkah.
2. **Detail Proyek** — timeline tangkapan kronologis, tag yang bisa diklik
   untuk memfilter feed, kartu yang bisa di-expand.
3. **Buat Laporan** — pilih rentang (7 hari / semua waktu), lalu draf
   laporan tersusun otomatis dengan judul, ringkasan, dan caption foto yang
   bisa diedit langsung di tempat.
4. **Hubungkan WhatsApp** — onboarding 2 langkah dengan contoh visual chat
   forward.

Melebar ke layar ≥900px untuk melihat layout dua kolom (daftar proyek di
kiri, timeline terpilih di kanan).

## Struktur

- `src/screens/` — 4 layar utama (`Home`, `ProjectDetail`, `ReportDraft`,
  `Onboarding`) plus `EmptyState`.
- `src/components/` — kartu, chip tag, navigasi bawah, toast, dan primitif
  visual bersama (placeholder foto, tanda suara, tombol kembali).
- `src/data/seed.ts` — data contoh dua proyek untuk demo alur onboarding.
- `src/index.css` — token desain (warna, tipografi, bayangan) untuk tema
  terang dan gelap.

## Stack

Vite + React + TypeScript + Tailwind CSS v4. Font (Fraunces, Public Sans,
IBM Plex Mono) di-self-host dari `public/fonts` — tidak bergantung ke CDN
eksternal saat runtime.
