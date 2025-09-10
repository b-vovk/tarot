import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import ClientHeader from "@/components/ClientHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleTagManager from "@/components/GoogleTagManager";
import SEO from "@/components/SEO";
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tarotdaily.club'),
  title: "Tarot Daily – Reveal your fortune",
  description: "Reveal your daily fortune with a simple 3-card tarot reading – love, career, destiny in one click.",
  keywords: ["tarot", "fortune", "daily reading", "love", "career", "destiny", "tarot cards", "divination"],
  authors: [{ name: "Tarot Daily" }],
  creator: "Tarot Daily",
  publisher: "Tarot Daily",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tarotdaily.club",
    title: "Tarot Daily – Reveal your fortune",
    description: "Reveal your daily fortune with a simple 3-card tarot reading – love, career, destiny in one click.",
    siteName: "Tarot Daily",
    images: [
      {
        url: "/images/mystic-star.svg",
        width: 1200,
        height: 630,
        alt: "Tarot Daily - Mystic Star",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarot Daily – Reveal your fortune",
    description: "Reveal your daily fortune with a simple 3-card tarot reading – love, career, destiny in one click.",
    images: ["/images/mystic-star.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    other: [
      { rel: "icon", url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { rel: "icon", url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { rel: "icon", url: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  },
  verification: {
    google: "googlebb31e28a5bd746cc",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" as="image" href="/images/sunburst-deco.svg" />
        <link rel="preload" as="image" href="/images/mystic-star.svg" />
        <link rel="preload" as="image" href="/images/moon-phase-deco.svg" />
        <link rel="preload" as="image" href="/images/compass-deco.svg" />
        
        {/* Google Analytics Script */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RRFYRMZH30"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RRFYRMZH30', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </head>
      {/* Ignore client-only attrs inserted by extensions */}
      <body suppressHydrationWarning className={`${inter.variable} ${cormorant.variable}`}>
        <Providers>
          <GoogleTagManager />
          <GoogleAnalytics />
          <SEO />
          <header className="siteHeader">
            <nav className="nav">
              <ClientHeader />
            </nav>
          </header>
          <main className="container">{children}</main>
          <footer className="siteFooter">
            <div className="container">
              © {new Date().getFullYear()} Tarot Daily
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
