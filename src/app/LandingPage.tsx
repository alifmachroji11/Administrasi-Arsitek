"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./landing.module.css";
import { BrandWordmark } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TransitionLink } from "@/components/TransitionLink";
import { Splash } from "@/components/Splash";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const MINI_ROWS: Array<{ when: string; text: string; tag: "Progres" | "Revisi" }> = [
  { when: "09.12", text: "Keramik teras selesai dipasang", tag: "Progres" },
  { when: "11.40", text: "Klien minta pagar diganti hijau tua", tag: "Revisi" },
  { when: "16.05", text: "Pondasi carport selesai dicor", tag: "Progres" },
  { when: "Kamis", text: "Voice note: material atap sudah tiba di lokasi", tag: "Progres" },
  { when: "Kamis", text: "Klien setuju revisi warna pagar", tag: "Revisi" },
];

function formatClock(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
}

function useLiveClock(): string {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    // Genuinely reading the real clock — can't render this on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(formatClock(new Date()));
    const id = window.setInterval(() => setNow(formatClock(new Date())), 30000);
    return () => window.clearInterval(id);
  }, []);

  return now ?? "";
}

function MiniApp({ variant }: { variant: "laptop" | "phone" }) {
  const clock = useLiveClock();
  return (
    <div className={cx(styles.miniApp, variant === "phone" && styles.miniAppPhone)}>
      <div className={styles.miniScroll}>
        <div className={styles.miniTop}>
          <BrandWordmark iconSize={13} textSize="clamp(9px, 4.6cqw, 12px)" gap={5} />
          <span className={styles.miniPill}>Aktif</span>
        </div>
        <div className={styles.miniHero}>
          <span className={styles.miniEyebrow}>Renovasi Rumah Bu Sari</span>
          <p className={styles.miniHeadline}>
            Catatan proyek, <em>tersusun sendiri</em>
          </p>
        </div>
        <div className={styles.miniList}>
          {MINI_ROWS.map((row, i) => (
            <div key={`${row.when}-${i}`} className={styles.miniRow}>
              <span className={cx(styles.miniWhen, styles.mono)}>{row.when}</span>
              <span className={cx(styles.miniTag, row.tag === "Revisi" ? styles.miniTagRevisi : styles.miniTagProgres)} />
              <span className={styles.miniRowText}>{row.text}</span>
            </div>
          ))}
        </div>
        <TransitionLink href="/register" className={styles.miniCta}>
          {variant === "phone" ? "Kirim Laporan" : "Kirim Laporan Minggu Ini"}
        </TransitionLink>
      </div>
      {variant === "laptop" && (
        <div className={styles.miniTaskbar}>
          <span className={styles.miniStart} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className={cx(styles.miniTaskClock, styles.mono)}>{clock}</span>
        </div>
      )}
    </div>
  );
}

export function LandingPage() {
  const navRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle(styles.topScrolled, window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(`.${styles.reveal}`);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealIn);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      <Splash />
      <nav ref={navRef} className={styles.top}>
        <BrandWordmark iconSize={24} textSize={19} />
        <span className={styles.navActions}>
          <ThemeToggle />
          <Link className={styles.navCta} href="#kenapa">
            Kenapa NotulArs?
          </Link>
        </span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Untuk arsitek praktik mandiri &amp; studio kecil</span>
          <h1 className={styles.heroTitle}>
            Catatan proyekmu, <em>tersusun sendiri</em> — dari pesan yang sudah kamu kirim
          </h1>
          <p className={styles.lede}>
            Foto lapangan, voice note, revisi lisan — semuanya sudah kamu forward ke WhatsApp klien tiap hari. NotulArs
            hanya membaca yang sudah ada, lalu merapikannya. Tidak ada aplikasi baru yang harus dipelajari tim kamu.
          </p>
          <div className={styles.actions}>
            <Link className={styles.btnPrimary} href="#case">
              Baca cerita Alif
            </Link>
            <Link className={styles.btnGhost} href="#cara-kerja">
              Lihat cara kerjanya
            </Link>
          </div>

          <div className={cx(styles.deviceShowcase, styles.reveal)}>
            <div className={styles.laptop}>
              <div className={styles.laptopBody}>
                <span className={styles.laptopCam} aria-hidden="true" />
                <div className={styles.laptopScreen}>
                  <MiniApp variant="laptop" />
                </div>
              </div>
              <div className={styles.laptopBase} aria-hidden="true">
                <div className={styles.laptopHinge} />
              </div>
            </div>
            <div className={styles.phone}>
              <div className={styles.phoneIsland} aria-hidden="true" />
              <div className={styles.phoneScreen}>
                <MiniApp variant="phone" />
              </div>
            </div>
          </div>
          <p className={styles.deviceCaption}>
            &ldquo;Pesan WhatsApp yang masuk, tersusun jadi catatan proyek — di laptop maupun di HP.&rdquo;
          </p>
        </div>
      </header>

      <section id="cara-kerja" className={styles.section}>
        <div className={styles.wrap}>
          <div className={cx(styles.sectionHead, styles.reveal)}>
            <span className={styles.eyebrow}>Cara kerjanya</span>
            <h2>Tiga langkah, tidak lebih</h2>
            <p>Tidak ada pelatihan tim, tidak ada aplikasi baru untuk klien atau tukang. Yang berubah cuma satu nomor tujuan forward.</p>
          </div>
          <div className={styles.steps}>
            <div className={cx(styles.step, styles.reveal)}>
              <span className={cx(styles.stepNum, styles.mono)}>01</span>
              <h3>Forward seperti biasa</h3>
              <p>Foto progres, voice note dari lokasi, catatan revisi klien — kirim ke nomor NotulArs, sama seperti forward ke rekan kerja.</p>
            </div>
            <div className={cx(styles.step, styles.reveal)}>
              <span className={cx(styles.stepNum, styles.mono)}>02</span>
              <h3>NotulArs membaca &amp; menandai</h3>
              <p>Tiap tangkapan otomatis masuk ke proyek yang tepat, ditandai progres, revisi, atau perlu tindak lanjut — tanpa kamu susun manual.</p>
            </div>
            <div className={cx(styles.step, styles.reveal)}>
              <span className={cx(styles.stepNum, styles.mono)}>03</span>
              <h3>Laporan tinggal kirim</h3>
              <p>Pilih rentang tanggal, draf laporan tersusun dengan ringkasan dan foto terpilih. Edit secukupnya, kirim ke klien.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={cx(styles.case, styles.section)} id="case">
        <div className={styles.wrap}>
          <div className={cx(styles.sectionHead, styles.reveal)}>
            <span className={styles.eyebrow}>Contoh nyata</span>
            <h2>Malam Minggu yang kembali jadi milik Alif</h2>
          </div>

          <div className={styles.caseGrid}>
            <div className={cx(styles.caseCard, styles.reveal)}>
              <p className={styles.quote}>
                &ldquo;Dulu tiap malam Minggu saya duduk dua jam nyusun ulang chat dari tiga proyek sekaligus. Sekarang
                saya buka NotulArs, laporannya sudah setengah jadi — saya tinggal baca ulang lima menit.&rdquo;
              </p>
              <div className={styles.casePerson}>
                <div className={styles.caseAvatar}>AM</div>
                <div>
                  <div className={styles.name}>Alif Machroji</div>
                  <div className={styles.role}>Arsitek praktik mandiri, Bandung — 3 proyek renovasi rumah tinggal berjalan</div>
                </div>
              </div>

              <div className={styles.statGrid}>
                <div className={styles.stat}>
                  <div className={cx(styles.value, styles.mono, styles.valueAccent)}>2 jam &rarr; 5 menit</div>
                  <div className={styles.label}>Waktu susun laporan mingguan</div>
                </div>
                <div className={styles.stat}>
                  <div className={cx(styles.value, styles.mono)}>
                    ±180<span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-ink-faint)" }}> /minggu</span>
                  </div>
                  <div className={styles.label}>Pesan WhatsApp dari 3 proyek</div>
                </div>
                <div className={styles.stat}>
                  <div className={cx(styles.value, styles.mono, styles.valueMoss)}>0</div>
                  <div className={styles.label}>Revisi lisan yang terlewat, 3 bulan terakhir</div>
                </div>
                <div className={styles.stat}>
                  <div className={cx(styles.value, styles.mono)}>14 hari</div>
                  <div className={styles.label}>Dari coba-coba sampai jadi kebiasaan tim</div>
                </div>
              </div>
            </div>

            <div className={styles.reveal}>
              <p style={{ fontSize: 13, color: "var(--color-ink-faint)", margin: "0 0 16px" }}>
                Selasa, 14 Mei — proyek Renovasi Rumah Bu Sari
              </p>
              <div className={styles.timeline}>
                <div className={styles.tlItem}>
                  <div className={cx(styles.tlWhen, styles.mono)}>09.12</div>
                  <div className={styles.tlWhat}>
                    <span className={cx(styles.tag, styles.tagProgres)}>Progres</span>
                    Tukang forward foto: keramik teras selesai dipasang.
                  </div>
                </div>
                <div className={styles.tlItem}>
                  <div className={cx(styles.tlWhen, styles.mono)}>11.40</div>
                  <div className={styles.tlWhat}>
                    <span className={cx(styles.tag, styles.tagRevisi)}>Revisi</span>
                    Klien minta warna pagar diganti jadi hijau tua.
                  </div>
                </div>
                <div className={styles.tlItem}>
                  <div className={cx(styles.tlWhen, styles.mono)}>16.05</div>
                  <div className={styles.tlWhat}>
                    <span className={cx(styles.tag, styles.tagProgres)}>Progres</span>
                    Voice note dari lokasi: pondasi carport selesai dicor.
                  </div>
                </div>
                <div className={styles.tlItem}>
                  <div className={cx(styles.tlWhen, styles.mono)}>Kamis</div>
                  <div className={styles.tlWhat} style={{ color: "var(--color-ink-soft)" }}>
                    Alif buka NotulArs, semua tangkapan minggu ini sudah tersusun rapi. Laporan siap dikirim dalam lima
                    menit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="kenapa">
        <div className={styles.wrap}>
          <div className={cx(styles.sectionHead, styles.reveal)}>
            <span className={styles.eyebrow}>Kenapa terasa ringan</span>
            <h2>NotulArs sengaja tidak menambah kerjaan</h2>
          </div>
          <div className={cx(styles.featureRow, styles.reveal)}>
            <div className={styles.feature}>
              <h3>Tidak pindah kanal</h3>
              <p>Klien dan tukang tetap kirim ke WhatsApp seperti biasa. Yang berubah cuma satu nomor tujuan forward dari kamu.</p>
            </div>
            <div className={styles.feature}>
              <h3>Tidak perlu diketik ulang</h3>
              <p>Foto, suara, dan teks yang masuk dibaca apa adanya. NotulArs menyusun, bukan mengganti cara kamu bekerja.</p>
            </div>
            <div className={styles.feature}>
              <h3>Bisa dicari kembali</h3>
              <p>Lupa material apa yang dipakai bulan lalu? Tanya dengan bahasa biasa, jawabannya lengkap dengan sumber aslinya.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={cx(styles.closing, styles.section)}>
        <div className={styles.wrap}>
          <h2 className={styles.reveal}>Coba dengan proyek yang sedang berjalan sekarang</h2>
          <p className={styles.reveal}>
            Tidak perlu migrasi data, tidak perlu ganti kebiasaan forward. Hubungkan satu nomor, lihat tangkapan
            pertama tersusun dalam hitungan menit.
          </p>
          <div className={cx(styles.actions, styles.reveal)} style={{ justifyContent: "center" }}>
            <TransitionLink className={styles.btnPrimary} href="/register">
              Hubungkan Nomor WhatsApp
            </TransitionLink>
          </div>
          <p className={cx(styles.closingNote, styles.reveal)}>
            Masuk atau daftar dulu pakai Google — prosesnya kurang dari satu menit.{" "}
            <TransitionLink href="/login" className={styles.closingNoteLink}>
              Sudah punya akun? Masuk
            </TransitionLink>
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <BrandWordmark iconSize={18} textSize={15} />
          <span className={styles.fine}>Dibuat untuk arsitek yang lebih suka di lokasi daripada di depan laporan.</span>
        </div>
      </footer>
    </div>
  );
}
