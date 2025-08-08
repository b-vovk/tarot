import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import ClientHeader from "@/components/ClientHeader";

export const metadata: Metadata = {
  title: "Tarot Daily – Reveal your fortune",
  description: "Simple 3-card tarot reveal on click",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" as="image" href="/images/sunburst-deco.svg" />
        <link rel="preload" as="image" href="/images/mystic-star.svg" />
        <link rel="preload" as="image" href="/images/lunar-wave.svg" />
       
      </head>
      {/* Ignore client-only attrs inserted by extensions */}
      <body suppressHydrationWarning>
        <Providers>
          <header className="siteHeader">
            <nav className="nav">
              <ClientHeader />
            </nav>
          </header>
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
