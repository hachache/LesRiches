import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lecart.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "L'Écart | Comprendre les fortunes extrêmes",
    template: "%s | L'Écart",
  },
  description:
    "Comparez un salaire net ou une épargne aux fortunes extrêmes avec du temps, des ratios et des repères concrets.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "L'Écart | Comprendre les fortunes extrêmes",
    description:
      "Un comparateur pédagogique pour rendre les fortunes extrêmes lisibles avec un salaire, une épargne et des ordres de grandeur concrets.",
    url: siteUrl,
    siteName: "L'Écart",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${robotoCondensed.variable} antialiased`}>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3 focus:font-semibold">
          Aller au contenu
        </a>
        <SiteNav />
        <PageShell>{children}</PageShell>
        <SiteFooter />
      </body>
    </html>
  );
}
