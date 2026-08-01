import type { Metadata, Viewport } from "next";
import { Fraunces, Lato, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "NotulArs — Catatan Proyek dari WhatsApp",
  description: "NotulArs menyusun tangkapan WhatsApp jadi catatan proyek arsitektur yang rapi dengan sendirinya.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#201a13" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${lato.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
