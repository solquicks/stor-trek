"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Marketplace", href: "/marketplace" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(2, 5, 10, 0.9)"
          : "rgba(2, 5, 10, 0.6)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(245, 145, 55, 0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Stor Trek"
              width={120}
              height={40}
              className="object-contain h-10 w-auto transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href.split("#")[0];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-inter, Inter, sans-serif)",
                    color: isActive ? "#F59137" : "rgba(248,242,230,0.75)",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#F59137")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = isActive
                      ? "#F59137"
                      : "rgba(248,242,230,0.75)")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Schedule link + Wallet */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/schedule"
              className="text-sm font-medium transition-colors duration-200"
              style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                color: "rgba(248,242,230,0.75)",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#FFEF46")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "rgba(248,242,230,0.75)")
              }
            >
              Schedule
            </Link>
            <WalletMultiButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: "#F59137",
                transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none",
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: "#F59137",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: "#F59137",
                transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden pb-4 border-t"
            style={{ borderColor: "rgba(245,145,55,0.15)" }}
          >
            <nav className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "var(--font-inter, Inter, sans-serif)",
                    color: "rgba(248,242,230,0.75)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/schedule"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium"
                style={{
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                  color: "rgba(248,242,230,0.75)",
                }}
              >
                Schedule
              </Link>
              <div className="mt-2">
                <WalletMultiButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
