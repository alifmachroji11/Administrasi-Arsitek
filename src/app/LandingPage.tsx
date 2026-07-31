"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./landing.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

interface Bubble {
  text: string;
  tag: "Progres" | "Revisi";
  x: number;
  delay: number;
}

const BUBBLES: Bubble[] = [
  { text: "Keramik teras selesai", tag: "Progres", x: 0.16, delay: 0 },
  { text: "Pagar jadi hijau tua", tag: "Revisi", x: 0.62, delay: 0.9 },
  { text: "Pondasi carport dicor", tag: "Progres", x: 0.3, delay: 1.8 },
];
const CYCLE = 4.2;

function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function LandingPage() {
  const navRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let start = performance.now();
    let raf = 0;

    function readTokens() {
      const cs = getComputedStyle(document.documentElement);
      return {
        paper: cs.getPropertyValue("--color-card").trim(),
        line: cs.getPropertyValue("--color-stone-line").trim(),
        ink: cs.getPropertyValue("--color-ink").trim(),
        inkFaint: cs.getPropertyValue("--color-ink-faint").trim(),
        accent: cs.getPropertyValue("--color-accent").trim(),
        moss: cs.getPropertyValue("--color-tag-progres").trim(),
      };
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const t = ((now - start) / 1000) % CYCLE;
      const tok = readTokens();

      ctx.clearRect(0, 0, w, h);

      const trayY = h * 0.74;
      roundRect(ctx, w * 0.14, trayY, w * 0.72, h * 0.2, 14);
      ctx.fillStyle = tok.paper;
      ctx.strokeStyle = tok.line;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = tok.inkFaint;
      ctx.font = '500 12px "Public Sans", sans-serif';
      ctx.fillText("Renovasi Rumah Bu Sari — 3 tangkapan tersusun", w * 0.14 + 18, trayY + 26);
      for (let i = 0; i < 3; i++) {
        const ly = trayY + 46 + i * 16;
        ctx.strokeStyle = tok.line;
        ctx.beginPath();
        ctx.moveTo(w * 0.14 + 18, ly);
        ctx.lineTo(w * 0.14 + w * 0.72 * (i === 1 ? 0.5 : 0.68) - 18, ly);
        ctx.stroke();
      }

      BUBBLES.forEach((b) => {
        let local = t - b.delay;
        if (local < 0) local += CYCLE;
        const settleAt = 2.0;
        const bx = w * b.x;
        let by: number;
        let alpha: number;
        let scale: number;

        if (local < settleAt) {
          const p = ease(Math.min(local / settleAt, 1));
          by = h * 0.08 + p * (trayY - h * 0.08 - 30);
          alpha = Math.min(local / 0.3, 1);
          scale = 1;
        } else {
          by = trayY - 30;
          const settledT = local - settleAt;
          alpha = Math.max(1 - settledT / 1.6, 0);
          scale = 1 - Math.min(settledT / 2.2, 1) * 0.28;
        }
        if (local >= CYCLE - 0.05) alpha = 0;
        if (alpha <= 0.02) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(bx, by);
        ctx.scale(scale, scale);

        const padX = 14;
        ctx.font = '500 13px "Public Sans", sans-serif';
        const tw = ctx.measureText(b.text).width;
        const bw = tw + padX * 2 + 46;
        const bh = 34;

        roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 17);
        ctx.fillStyle = tok.paper;
        ctx.strokeStyle = tok.line;
        ctx.fill();
        ctx.stroke();

        const dotColor = b.tag === "Revisi" ? tok.accent : tok.moss;
        ctx.beginPath();
        ctx.arc(-bw / 2 + 16, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        ctx.fillStyle = tok.ink;
        ctx.textBaseline = "middle";
        ctx.fillText(b.text, -bw / 2 + 26, 1);

        ctx.restore();
      });

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    if (reduceMotion) {
      start = performance.now() - 1.999 * 1000;
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      <nav ref={navRef} className={styles.top}>
        <span className={styles.word}>Notula</span>
        <Link className={styles.navCta} href="#case">
          Lihat contoh nyata
        </Link>
      </nav>

      <header className={styles.hero}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Untuk arsitek praktik mandiri &amp; studio kecil</span>
          <h1 className={styles.heroTitle}>
            Catatan proyekmu, <em>tersusun sendiri</em> — dari pesan yang sudah kamu kirim
          </h1>
          <p className={styles.lede}>
            Foto lapangan, voice note, revisi lisan — semuanya sudah kamu forward ke WhatsApp klien tiap hari. Notula
            cuma membaca yang sudah ada, lalu merapikannya. Tidak ada aplikasi baru yang harus dipelajari tim kamu.
          </p>
          <div className={styles.actions}>
            <Link className={styles.btnPrimary} href="#case">
              Baca cerita Nadia
            </Link>
            <Link className={styles.btnGhost} href="#cara-kerja">
              Lihat cara kerjanya
            </Link>
          </div>

          <div className={cx(styles.sceneFrame, styles.reveal)}>
            <canvas ref={canvasRef} className={styles.scene} aria-hidden="true" />
            <div className={styles.sceneCaption}>
              <span className={styles.sceneDot} />
              Pesan WhatsApp yang masuk, tersusun jadi catatan proyek — tanpa kamu ketik ulang.
            </div>
          </div>
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
              <p>Foto progres, voice note dari lokasi, catatan revisi klien — kirim ke nomor Notula, sama seperti forward ke rekan kerja.</p>
            </div>
            <div className={cx(styles.step, styles.reveal)}>
              <span className={cx(styles.stepNum, styles.mono)}>02</span>
              <h3>Notula membaca &amp; menandai</h3>
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
            <h2>Malam Minggu yang kembali jadi milik Nadia</h2>
          </div>

          <div className={styles.caseGrid}>
            <div className={cx(styles.caseCard, styles.reveal)}>
              <p className={styles.quote}>
                &ldquo;Dulu tiap Minggu malam saya duduk dua jam nyusun ulang chat dari tiga proyek sekaligus. Sekarang
                saya buka Notula, laporannya sudah setengah jadi — saya tinggal baca ulang lima menit.&rdquo;
              </p>
              <div className={styles.casePerson}>
                <div className={styles.caseAvatar}>NP</div>
                <div>
                  <div className={styles.name}>Nadia Puspita</div>
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
                    Nadia buka Notula, semua tangkapan minggu ini sudah tersusun rapi. Laporan siap dikirim dalam lima
                    menit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={cx(styles.sectionHead, styles.reveal)}>
            <span className={styles.eyebrow}>Kenapa terasa ringan</span>
            <h2>Notula sengaja tidak menambah kerjaan</h2>
          </div>
          <div className={cx(styles.featureRow, styles.reveal)}>
            <div className={styles.feature}>
              <h3>Tidak pindah kanal</h3>
              <p>Klien dan tukang tetap kirim ke WhatsApp seperti biasa. Yang berubah cuma satu nomor tujuan forward dari kamu.</p>
            </div>
            <div className={styles.feature}>
              <h3>Tidak perlu diketik ulang</h3>
              <p>Foto, suara, dan teks yang masuk dibaca apa adanya. Notula menyusun, bukan mengganti cara kamu bekerja.</p>
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
            <Link className={styles.btnPrimary} href="/register">
              Hubungkan Nomor WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <span className={styles.footerWord}>Notula</span>
          <span className={styles.fine}>Dibuat untuk arsitek yang lebih suka di lokasi daripada di depan laporan.</span>
        </div>
      </footer>
    </div>
  );
}
