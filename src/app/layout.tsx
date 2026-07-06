import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = "https://combien-de-smic.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Combien de SMIC représente une fortune ?",
    template: "%s | Combien de SMIC",
  },
  description:
    "Comparez votre salaire et votre épargne aux ultra-riches avec des repères concrets : années de revenu, patrimoine, écoles, alimentation et hôpitaux.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Combien de SMIC représente une fortune ?",
    description:
      "Un comparateur pédagogique pour rendre les fortunes extrêmes lisibles avec des ordres de grandeur concrets.",
    url: siteUrl,
    siteName: "Combien de SMIC",
    locale: "fr_FR",
    type: "website",
  },
};

const navItems = [
  ["Comparer", "Comp.", "/comparateur"],
  ["Milliardaires", "Fort.", "/milliardaires"],
  ["Méthodologie", "Méth.", "/methodologie"],
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}>
      <body>
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black text-white backdrop-blur-md">
          <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm">
              <span className="h-5 w-1 bg-[var(--accent)]" />
              <span className="sm:hidden">SMIC</span>
              <span className="hidden sm:inline">Combien de SMIC</span>
            </Link>
            <Link
              href="/comparateur"
              className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white/82 sm:hidden"
            >
              Comparer
            </Link>
            <div className="hidden min-w-0 items-center gap-0 text-xs font-medium sm:flex sm:gap-1 sm:text-sm">
              {navItems.map(([label, shortLabel, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full px-1.5 py-2 text-white/68 transition hover:bg-white/10 hover:text-white sm:px-3"
                >
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
