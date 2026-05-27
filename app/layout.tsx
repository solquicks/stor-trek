import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletProvider from "@/components/WalletProvider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stor Trek — Storage of the Future",
  description:
    "On-chain storage management powered by Solana. Mint your items as NFTs, schedule pickups, and trade storage rights on the marketplace.",
  keywords: ["storage", "solana", "NFT", "web3", "on-chain", "stor trek"],
  openGraph: {
    title: "Stor Trek — Storage of the Future",
    description: "On-chain storage management powered by Solana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative" style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        {/* Animated star field background */}
        <div className="stars-bg" aria-hidden="true">
          {/* Stars are rendered via CSS + JS in client components */}
        </div>

        <WalletProvider>
          <Navbar />
          <main className="relative z-10 flex-1 flex flex-col">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
