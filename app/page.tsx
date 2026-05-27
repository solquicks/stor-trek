"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Star field generator ── */
function StarField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const count = 160;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      const size = Math.random() * 2.5 + 0.5;
      s.className = "star";
      s.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        --duration:${Math.random() * 4 + 2}s;
        --delay:${Math.random() * 5}s;
        opacity:${Math.random() * 0.6 + 0.1};
      `;
      fragment.appendChild(s);
    }
    container.appendChild(fragment);
    return () => { container.innerHTML = ""; };
  }, []);

  return <div ref={ref} className="stars-bg" aria-hidden="true" />;
}

/* ── How It Works Steps ── */
const steps = [
  {
    n: "01",
    icon: "📦",
    title: "Pack Your Items",
    desc: "Prepare your belongings for pickup. We accept furniture, electronics, boxes, bikes, and more.",
  },
  {
    n: "02",
    icon: "🚀",
    title: "Schedule a Pickup",
    desc: "Choose your date and time window. Our crew arrives at your door — no truck rental needed.",
  },
  {
    n: "03",
    icon: "🧾",
    title: "Item Intake & Photo",
    desc: "Our staff photographs and catalogues every item with a unique identifier for your records.",
  },
  {
    n: "04",
    icon: "🪙",
    title: "NFT Minted on Solana",
    desc: "Each item gets minted as an NFT on the Solana blockchain — your proof of ownership, immutable and instant.",
  },
  {
    n: "05",
    icon: "🏛️",
    title: "Secure Climate Storage",
    desc: "Items are stored in our state-of-the-art climate-controlled facility until you need them back.",
  },
  {
    n: "06",
    icon: "💱",
    title: "Trade on Marketplace",
    desc: "List your storage NFTs on our marketplace. Buyers inherit the storage contract — you get paid instantly.",
  },
  {
    n: "07",
    icon: "🏠",
    title: "Schedule Retrieval",
    desc: "Ready for your stuff back? Schedule a delivery and we'll bring it right to your door.",
  },
];

/* ── Pricing tiers ── */
const tiers = [
  {
    name: "Starter Pod",
    badge: "badge-green",
    badgeText: "Entry Level",
    emoji: "🛸",
    desc: "Perfect for a few boxes or small items.",
    weekly: 12,
    monthly: 45,
    annual: 432,
    features: [
      "Up to 5 sq ft",
      "Free first pickup",
      "1 NFT per item",
      "Marketplace access",
      "Email support",
    ],
    cta: "Start Storing",
    highlight: false,
  },
  {
    name: "Explorer Bay",
    badge: "badge-orange",
    badgeText: "Best Value",
    emoji: "🚀",
    desc: "Ideal for a room's worth of items.",
    weekly: 32,
    monthly: 119,
    annual: 1140,
    features: [
      "Up to 25 sq ft",
      "Free pickups & returns",
      "NFTs for all items",
      "Priority marketplace listing",
      "Chat + phone support",
    ],
    cta: "Launch Now",
    highlight: true,
  },
  {
    name: "Voyager Suite",
    badge: "badge-yellow",
    badgeText: "Power User",
    emoji: "🛰️",
    desc: "For movers, collectors, or small businesses.",
    weekly: 79,
    monthly: 299,
    annual: 2868,
    features: [
      "Up to 75 sq ft",
      "Unlimited pickups & returns",
      "Bulk NFT minting",
      "Featured marketplace listings",
      "Dedicated account manager",
    ],
    cta: "Go Voyager",
    highlight: false,
  },
  {
    name: "Command Deck",
    badge: "badge-pink",
    badgeText: "Enterprise",
    emoji: "🌌",
    desc: "Full-service solution for businesses and high-volume storage.",
    weekly: null as null,
    monthly: null as null,
    annual: null as null,
    features: [
      "Unlimited space",
      "Custom pickup schedules",
      "White-label NFT minting",
      "API access",
      "SLA & dedicated team",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

type BillingCycle = "weekly" | "monthly" | "annual";

export default function HomePage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const getPrice = (tier: (typeof tiers)[0]) => {
    if (tier.weekly === null) return "Custom";
    if (billing === "weekly") return `$${tier.weekly}`;
    if (billing === "monthly") return `$${tier.monthly}`;
    return `$${tier.annual}`;
  };

  const getPeriod = () => {
    if (billing === "weekly") return "/week";
    if (billing === "monthly") return "/month";
    return "/year";
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus("loading");
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxWHGWSoyP0sUJc2FGVYvi6bzTaPIJoRtyIIO3ZJXWj3PqT7en9W23PWGlEwUppy-UCQw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: waitlistName,
            email: waitlistEmail,
            source: "landing_waitlist",
            timestamp: new Date().toISOString(),
          }),
        }
      );
      setWaitlistStatus("success");
      setWaitlistEmail("");
      setWaitlistName("");
    } catch {
      setWaitlistStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarField />

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16 text-center">
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(45,27,61,0.9) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center gap-8 max-w-4xl mx-auto">
          <Image
            src="/logo.png"
            alt="Stor Trek"
            width={320}
            height={110}
            className="object-contain w-64 md:w-80 lg:w-96"
            priority
          />

          <span
            className="badge-orange text-xs tracking-widest px-4 py-1.5"
            style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)" }}
          >
            Storage of the Future
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight"
            style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
          >
            Storage,{" "}
            <span className="text-gradient-orange">Reinvented.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: "rgba(248,242,230,0.7)" }}>
            Every item you store is minted as an NFT on Solana. Own your storage.
            Trade it. Reclaim it. Stor Trek makes physical storage liquid,
            transparent, and on-chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-4">
              🚀 Enter the Dock
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-base px-8 py-4">
              How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 mt-4 flex-wrap justify-center">
            {[
              { val: "2,400+", label: "Items Stored", color: "#F59137" },
              { val: "850+", label: "NFTs Minted", color: "#FFEF46" },
              { val: "$0 Gas", label: "Solana Speed", color: "#EB729A" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8" style={{ background: "rgba(248,242,230,0.15)" }} />}
                <div className="flex flex-col items-center">
                  <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: stat.color }}
                  >
                    {stat.val}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span
            className="text-xs tracking-widest"
            style={{ color: "rgba(248,242,230,0.3)", fontFamily: "var(--font-orbitron, Orbitron, sans-serif)" }}
          >
            SCROLL
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "rgba(245,145,55,0.5)" }}>
            <path d="M8 2v12M3 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-yellow mb-4 inline-block">The Process</span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              How Stor Trek Works
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "rgba(248,242,230,0.6)" }}>
              From your front door to the blockchain — in seven simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="card group relative overflow-hidden">
                <span
                  className="absolute -top-2 -right-2 text-7xl font-black opacity-5 select-none pointer-events-none"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
                >
                  {step.n}
                </span>
                <div className="text-3xl mb-3">{step.icon}</div>
                <div
                  className="text-xs font-bold tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
                >
                  STEP {step.n}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(248,242,230,0.65)" }}>
                  {step.desc}
                </p>
              </div>
            ))}

            {/* CTA card */}
            <div
              className="card flex flex-col items-center justify-center text-center gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(245,145,55,0.15), rgba(45,27,61,0.6))",
                borderColor: "rgba(245,145,55,0.4)",
              }}
            >
              <div className="text-4xl">⭐</div>
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
              >
                Ready to Launch?
              </h3>
              <p className="text-sm" style={{ color: "rgba(248,242,230,0.65)" }}>
                Join the waitlist and be among the first to store on-chain.
              </p>
              <a href="#waitlist" className="btn-primary text-sm px-6 py-3">
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-pink mb-4 inline-block">Pricing</span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              Choose Your Mission
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "rgba(248,242,230,0.6)" }}>
              Transparent pricing with no hidden fees. Pay weekly, monthly, or save with annual.
            </p>

            {/* Billing toggle */}
            <div
              className="inline-flex items-center gap-1 mt-8 p-1 rounded-lg"
              style={{ background: "rgba(45,27,61,0.6)", border: "1px solid rgba(245,145,55,0.15)" }}
            >
              {(["weekly", "monthly", "annual"] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 capitalize"
                  style={{
                    fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                    background: billing === cycle ? "#F59137" : "transparent",
                    color: billing === cycle ? "#02050A" : "rgba(248,242,230,0.6)",
                    fontSize: "0.75rem",
                  }}
                >
                  {cycle}
                  {cycle === "annual" && (
                    <span
                      className="ml-1.5 text-xs"
                      style={{ color: billing === "annual" ? "#02050A" : "#FFEF46" }}
                    >
                      -20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="card flex flex-col gap-4 relative"
                style={{
                  background: tier.highlight
                    ? "linear-gradient(160deg, rgba(245,145,55,0.18), rgba(45,27,61,0.7))"
                    : undefined,
                  borderColor: tier.highlight ? "rgba(245,145,55,0.5)" : "rgba(245,145,55,0.15)",
                  boxShadow: tier.highlight ? "0 0 40px rgba(245,145,55,0.15)" : undefined,
                }}
              >
                {tier.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider whitespace-nowrap"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", background: "#F59137", color: "#02050A" }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-3xl">{tier.emoji}</span>
                  <div>
                    <h3
                      className="text-sm font-bold leading-tight"
                      style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                    >
                      {tier.name}
                    </h3>
                    <span className={tier.badge}>{tier.badgeText}</span>
                  </div>
                </div>

                <p className="text-xs" style={{ color: "rgba(248,242,230,0.6)" }}>{tier.desc}</p>

                <div className="flex items-end gap-1">
                  {tier.weekly !== null ? (
                    <>
                      <span
                        className="text-4xl font-black"
                        style={{
                          fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                          color: tier.highlight ? "#F59137" : "#F8F2E6",
                        }}
                      >
                        {getPrice(tier)}
                      </span>
                      <span className="text-sm pb-1" style={{ color: "rgba(248,242,230,0.5)" }}>
                        {getPeriod()}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-3xl font-black"
                      style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#EB729A" }}
                    >
                      Custom
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "rgba(248,242,230,0.75)" }}>
                      <span style={{ color: "#F59137", flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.weekly === null ? "#waitlist" : "/schedule"}
                  className={`${tier.highlight ? "btn-primary" : "btn-secondary"} text-center`}
                  style={{ fontSize: "0.75rem" }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── WAITLIST ── */}
      <section id="waitlist" className="relative z-10 py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="badge-orange mb-4 inline-block">Early Access</span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
          >
            Join the Waitlist
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(248,242,230,0.6)" }}>
            Be among the first to experience storage on-chain. Early members get
            1 month free storage + a commemorative Genesis NFT.
          </p>

          {waitlistStatus === "success" ? (
            <div
              className="card text-center py-10"
              style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.1), rgba(45,27,61,0.6))", borderColor: "rgba(52,211,153,0.3)" }}
            >
              <div className="text-5xl mb-4">🚀</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#34d399" }}
              >
                You&apos;re on the manifest!
              </h3>
              <p style={{ color: "rgba(248,242,230,0.7)" }}>
                We&apos;ll beam down your early access invite soon. Check your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={waitlistName}
                onChange={(e) => setWaitlistName(e.target.value)}
                className="w-full px-5 py-4 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "rgba(45,27,61,0.5)",
                  border: "1px solid rgba(245,145,55,0.2)",
                  color: "#F8F2E6",
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "rgba(45,27,61,0.5)",
                  border: "1px solid rgba(245,145,55,0.2)",
                  color: "#F8F2E6",
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
              />
              <button
                type="submit"
                disabled={waitlistStatus === "loading"}
                className="btn-primary w-full py-4 text-base"
              >
                {waitlistStatus === "loading" ? "Launching..." : "🌌 Reserve My Spot"}
              </button>
              {waitlistStatus === "error" && (
                <p className="text-sm" style={{ color: "#EB729A" }}>
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
              <p className="text-xs" style={{ color: "rgba(248,242,230,0.35)" }}>
                No spam. No rocket fuel fees. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t py-10 px-4" style={{ borderColor: "rgba(245,145,55,0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image src="/logo.png" alt="Stor Trek" width={100} height={36} className="object-contain" />
            <p className="text-xs" style={{ color: "rgba(248,242,230,0.35)" }}>
              Storage of the Future · Powered by Solana
            </p>
          </div>
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/marketplace", label: "Marketplace" },
              { href: "/intake", label: "Staff Intake" },
              { href: "/schedule", label: "Schedule" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs transition-colors"
                style={{ color: "rgba(248,242,230,0.5)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F59137")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(248,242,230,0.5)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(248,242,230,0.25)" }}>
            © {new Date().getFullYear()} Stor Trek LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
