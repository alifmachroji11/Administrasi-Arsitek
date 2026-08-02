import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NotulArs — Catatan Proyek dari WhatsApp",
  description: "NotulArs menyusun tangkapan WhatsApp jadi catatan proyek arsitektur yang rapi dengan sendirinya.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fafafa",
};

// Applies the saved theme choice to <html> before first paint — runs
// synchronously ahead of hydration so switching themes never flashes the
// other one. Defaults to light (not the OS preference) per product choice.
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("notula-theme")||"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
