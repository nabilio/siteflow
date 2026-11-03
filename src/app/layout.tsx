import type { Metadata } from "next";
import { Inter, Merriweather, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-serif", subsets: ["latin"], weight: ["300", "400", "700", "900"] });
const nunito = Nunito({ variable: "--font-rounded", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiteFlow",
  description: "Création et gestion de sites web",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${merriweather.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
