import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import ClientHeader from "@/components/ClientHeader";
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Tarot Daily – Reveal your fortune",
  description: "Reveal your daily fortune with a simple 3-card tarot reading – love, career, destiny in one click.",
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
        
       
      </head>
      {/* Ignore client-only attrs inserted by extensions */}
      <body suppressHydrationWarning className={`${inter.variable} ${cormorant.variable}`}>
        <Providers>
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
