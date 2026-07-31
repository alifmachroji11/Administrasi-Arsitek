# Notula

MVP full-stack untuk Notula — lapisan capture-to-document berbasis AI untuk
arsitek praktisi mandiri dan studio kecil. Arsitek forward foto lapangan,
voice note, dan catatan revisi ke bot WhatsApp per proyek; Notula
mengklasifikasikan tiap tangkapan lewat AI, menyusunnya jadi timeline per
proyek, dan mengubahnya jadi draf laporan siap kirim. Ingat, lapisan
pencarian semantik di atas data yang sama, hidup sebagai tab "Cari".

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi minimal AUTH_SECRET (npx auth secret)
npm run dev
```

Buka `http://localhost:3000`. Daftar akun baru → alur onboarding akan minta
nomor WhatsApp, mengirim OTP, lalu minta nama proyek pertama.

**Semua yang butuh kredensial eksternal berjalan di atas mock by default**
(lihat "Apa yang mock, apa yang nyata" di bawah) — jadi seluruh alur bisa
dicoba end-to-end tanpa Meta WABA, tanpa database, tanpa API key AI:

- OTP WhatsApp: kode ditampilkan langsung di layar (bukan dikirim
  sungguhan) selama `WHATSAPP_ACCESS_TOKEN` belum diisi.
- Klasifikasi tangkapan, ringkasan laporan, dan jawaban pencarian: pakai
  heuristik kata kunci sederhana selama `ANTHROPIC_API_KEY` belum diisi.
- Data proyek/tangkapan/laporan: disimpan in-memory (reset saat server
  restart) selama `DATABASE_URL` belum diisi.

Untuk mencoba pipeline capture WhatsApp secara nyata tanpa nomor WhatsApp
asli, simulasikan webhook Meta langsung lewat curl (ganti nomor dengan
nomor yang sudah kamu verifikasi lewat onboarding):

```bash
curl -X POST http://localhost:3000/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[
    {"from":"6281234567890","id":"wamid.1","type":"text","text":{"body":"/proyek Nama Proyek"}}
  ]}}]}]}'
```

Lalu kirim pesan sungguhan (foto/teks) ke proyek yang sama — bot butuh
command `/proyek <nama>` sekali di awal percakapan DM supaya tahu ke
proyek mana pesan berikutnya harus masuk (lihat catatan di bagian webhook
di bawah).

## Apa yang mock, apa yang nyata

Setiap integrasi eksternal ditulis di belakang sebuah interface, dengan
implementasi mock aktif secara default dan implementasi nyata yang
aktif otomatis begitu env var terkait diisi — tidak ada perubahan kode
yang dibutuhkan untuk pindah dari mock ke nyata.

| Lapisan | File | Mock (default) | Nyata (aktif via env) |
|---|---|---|---|
| Database | `src/server/db.ts`, `src/server/mock-repository.ts` | In-memory, reset tiap restart | `DATABASE_URL` — **belum diimplementasikan**, lihat catatan di bawah |
| WhatsApp | `src/server/whatsapp.ts` | Log ke console, OTP dikembalikan ke UI | `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` — panggilan Cloud API nyata, **belum pernah diuji ke WABA sungguhan** |
| AI | `src/server/ai.ts` | Heuristik kata kunci | `ANTHROPIC_API_KEY` + `ANTHROPIC_MODEL` — panggilan Messages API langsung, **belum pernah diuji dengan API key sungguhan** |

### Menghubungkan database nyata

`prisma/schema.prisma` sudah berisi skema lengkap (mengikuti Bagian 7 dari
brief produk, plus beberapa kolom tambahan yang ternyata dibutuhkan UI).
`PrismaRepository` **belum ditulis** — `src/server/mock-repository.ts`
adalah referensi persis apa yang perlu diimplementasikan tiap method
(interface-nya ada di `src/server/repository.ts`). Ini keputusan sadar,
bukan kelalaian: menulis implementasi Prisma tanpa database sungguhan
untuk diuji berisiko lolos dengan bug yang baru ketahuan saat produksi.
Setelah `DATABASE_URL` tersedia:

```bash
npx prisma migrate dev
# lalu implementasikan PrismaRepository dan kembalikan dari getRepository()
# di src/server/db.ts ketika process.env.DATABASE_URL terisi.
```

## Hal yang masih menunggu keputusan/verifikasi (Bagian 8 dari brief)

- **Verifikasi bisnis Meta & WABA** — proses ini di luar kendali kode,
  butuh dokumen legal entitas bisnis dan bisa makan waktu hari–minggu.
  Pakai sandbox test number Meta dulu untuk development.
- **Grup WhatsApp lewat Cloud API** — brief mengasumsikan bot bisa
  diundang ke grup WhatsApp pengguna seperti akun personal. Ini **belum
  terverifikasi** terhadap dokumentasi Meta terkini; WhatsApp Business
  Platform historically lebih terbatas untuk pesan grup dibanding akun
  personal. Konfirmasi ini sebelum bergantung pada alur grup di
  produksi — jalur DM (`webhook/whatsapp/route.ts`) adalah jalur yang
  sudah diimplementasikan dan lebih pasti jalannya.
- **Routing proyek untuk pesan DM** — skema Bagian 7 tidak menyediakan
  cara pesan DM tahu proyek mana yang dituju (grup punya
  `project_whatsapp_groups`, DM tidak). Solusi sementara: command
  `/proyek <nama>` yang mengeset "proyek aktif" per user
  (`getActiveProjectForUser`/`setActiveProjectForUser` di
  `src/server/repository.ts`) — bukan bagian dari skema resmi, perlu
  keputusan produk yang lebih baik (mis. UI "sedang forward ke proyek
  mana" di app).
- **Transkripsi voice note** — captures bertipe `voice` disimpan tanpa
  teks (`(voice note — transkripsi belum tersedia)`), jadi tidak
  terklasifikasi dengan baik dan tidak ikut ke pencarian. Butuh langkah
  speech-to-text yang tidak disebutkan di arsitektur Bagian 6.
- **Media asli (foto/audio)** — webhook menyimpan capture tanpa
  mengunduh media dari Cloud API (`mediaUrl: null`); perlu langkah
  fetch `/{media-id}` lalu upload ke Supabase Storage atau setara.
- **Privasi pesan grup** — pengirim grup yang belum verifikasi nomornya
  saat ini pesannya di-drop diam-diam (lihat `webhook/whatsapp/route.ts`).
  Ini keputusan produk yang menunggu, bukan hal yang diasumsikan sepihak.
- **Bagikan ke klien (PDF/WhatsApp)** — saat ini hanya menandai laporan
  sebagai "dibagikan" dan mengembalikan link internal. Export PDF dan
  kirim balik ke WhatsApp klien butuh message template yang disetujui
  Meta untuk pesan business-initiated (lihat Bagian 5) — belum dibangun.
- **Draf spesifikasi/RKS dari histori serupa** (Bagian 2.8) — belum
  dibangun sama sekali di build ini; scope MVP di sesi ini fokus ke
  fitur 1–7.
- **Biaya conversation-based Meta** — di luar scope teknis, tapi flag
  untuk product owner sebelum commit ke arsitektur ini secara publik.

## Arah visual

Palet krem hangat + aksen terracotta tunggal, tipografi Fraunces (display)
+ Public Sans (body) + IBM Plex Mono (metadata), dipertahankan dari
prototipe yang sudah dibangun dan disetujui sebelumnya di kedua app
(Notula dan Ingat). **Catatan:** brief produk yang menyertai task ini
menyebut arah visual berbeda (sage green `#707a55`, Lora + Work Sans, dari
draft prototipe paling awal) — arah itu sengaja tidak dipakai di build ini
karena bertentangan dengan sistem desain yang sudah dibangun, diuji, dan
disetujui berulang kali sepanjang sesi kerja ini (termasuk Ingat yang
dibangun belakangan mengikuti sistem yang sama). Beri tahu kalau memang
ingin beralih ke arah sage green — itu perubahan token warna terpusat di
`src/app/globals.css`, tidak perlu membangun ulang struktur apa pun.

## Struktur

- `src/app/` — route Next.js App Router: halaman (`login`, `register`,
  `onboarding`, `projects`, `search`, `profil`) dan API routes (`api/`).
- `src/server/` — batas server: repository (data), auth, WhatsApp, AI.
  Lihat tabel mock/nyata di atas.
- `src/components/`, `src/screens/` — komponen UI Notula (kartu, timeline,
  draf laporan) yang dipakai lintas halaman.
- `src/ingat/` — komponen dan tipe UI khusus Ingat (search bar, kartu
  sumber, jawaban AI).
- `prisma/schema.prisma` — skema database, siap pakai begitu
  `PrismaRepository` diimplementasikan.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + NextAuth v5. Font
di-optimalkan lewat `next/font/google` (self-host otomatis, tanpa
dependensi CDN saat runtime).
