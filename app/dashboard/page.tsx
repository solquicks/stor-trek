"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

/* ── Star field ── */
function StarField() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 80; i++) {
      const s = document.createElement("span");
      const size = Math.random() * 2 + 0.5;
      s.className = "star";
      s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--duration:${Math.random()*4+2}s;--delay:${Math.random()*5}s;opacity:${Math.random()*0.5+0.1};`;
      fragment.appendChild(s);
    }
    container.appendChild(fragment);
    return () => { container.innerHTML = ""; };
  }, []);
  return <div ref={ref} className="stars-bg" aria-hidden="true" />;
}

/* ── Mock items ── */
const mockItems = [
  {
    id: "001",
    name: "Sofa",
    emoji: "🛋️",
    category: "Furniture",
    size: "Large",
    weeklyRate: 18,
    daysStored: 47,
    condition: "Good",
    nftMint: "7xKz...4Fmn",
    estimatedValue: 450,
  },
  {
    id: "002",
    name: "Box of Books",
    emoji: "📚",
    category: "Boxes",
    size: "Small",
    weeklyRate: 4,
    daysStored: 31,
    condition: "Excellent",
    nftMint: "3pQr...8Wvt",
    estimatedValue: 60,
  },
  {
    id: "003",
    name: "Gaming Chair",
    emoji: "🎮",
    category: "Furniture",
    size: "Medium",
    weeklyRate: 10,
    daysStored: 12,
    condition: "Like New",
    nftMint: "9aRs...2Yhn",
    estimatedValue: 280,
  },
  {
    id: "004",
    name: '65" TV',
    emoji: "📺",
    category: "Electronics",
    size: "Large",
    weeklyRate: 16,
    daysStored: 22,
    condition: "Good",
    nftMint: "1mNp...6Cxd",
    estimatedValue: 700,
  },
];

const sizeBadge = (size: string) => {
  if (size === "Large") return "badge-orange";
  if (size === "Medium") return "badge-yellow";
  return "badge-green";
};

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState<"stored" | "activity">("stored");

  const totalMonthly = mockItems.reduce((sum, item) => sum + item.weeklyRate * 4, 0);

  const truncate = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              Storage Dock
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(248,242,230,0.5)" }}>
              Your on-chain storage manifest
            </p>
          </div>

          <div className="flex items-center gap-4">
            {connected && publicKey ? (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ background: "rgba(45,27,61,0.6)", border: "1px solid rgba(245,145,55,0.2)" }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} />
                <span className="text-xs font-mono" style={{ color: "#F8F2E6" }}>
                  {truncate(publicKey.toBase58())}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ background: "rgba(45,27,61,0.4)", border: "1px solid rgba(235,114,154,0.3)" }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: "#EB729A" }} />
                <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>
                  Wallet not connected
                </span>
              </div>
            )}
            <WalletMultiButton />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Items Stored", value: mockItems.length.toString(), icon: "📦", color: "#F59137" },
            { label: "Monthly Cost", value: `$${totalMonthly}`, icon: "💰", color: "#FFEF46" },
            { label: "Next Pickup", value: "Thu, Jun 5", icon: "📅", color: "#EB729A" },
            { label: "NFTs Minted", value: mockItems.length.toString(), icon: "🪙", color: "#34d399" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(248,242,230,0.5)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: "rgba(45,27,61,0.5)" }}>
          {(["stored", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-md text-sm font-semibold capitalize transition-all duration-200"
              style={{
                fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                fontSize: "0.75rem",
                background: activeTab === tab ? "#F59137" : "transparent",
                color: activeTab === tab ? "#02050A" : "rgba(248,242,230,0.55)",
              }}
            >
              {tab === "stored" ? "📦 Stored Items" : "📋 Activity"}
            </button>
          ))}
        </div>

        {activeTab === "stored" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {mockItems.map((item) => (
              <div key={item.id} className="card flex flex-col gap-3">
                {/* Emoji + title row */}
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{item.emoji}</div>
                  <span className="badge-orange text-xs"># {item.id}</span>
                </div>

                <div>
                  <h3
                    className="font-bold text-base"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(248,242,230,0.5)" }}>
                    {item.category}
                  </p>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-yellow">NFT</span>
                  <span className={sizeBadge(item.size)}>{item.size}</span>
                  <span className="badge-green">{item.condition}</span>
                </div>

                {/* NFT mint */}
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: "rgba(45,27,61,0.5)", border: "1px solid rgba(245,145,55,0.1)" }}
                >
                  <span className="text-xs" style={{ color: "rgba(248,242,230,0.45)" }}>Mint</span>
                  <span className="text-xs font-mono" style={{ color: "#FFEF46" }}>{item.nftMint}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
                    >
                      ${item.weeklyRate}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(248,242,230,0.45)" }}>/week</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                    >
                      {item.daysStored}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(248,242,230,0.45)" }}>days stored</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    href="/schedule"
                    className="btn-primary text-center py-2"
                    style={{ fontSize: "0.7rem" }}
                  >
                    📅 Schedule Pickup
                  </Link>
                  <Link
                    href="/marketplace"
                    className="btn-secondary text-center py-2"
                    style={{ fontSize: "0.7rem" }}
                  >
                    🏷️ List on Marketplace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="card">
            <h3
              className="font-bold text-base mb-6"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              Recent Activity
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { date: "May 15, 2026", action: "Item Stored", item: "Sofa #001", type: "in", tx: "7xKz...4Fmn" },
                { date: "May 10, 2026", action: "NFT Minted", item: "Gaming Chair #003", type: "mint", tx: "9aRs...2Yhn" },
                { date: "Apr 28, 2026", action: "Item Stored", item: "Box of Books #002", type: "in", tx: "3pQr...8Wvt" },
                { date: "Apr 20, 2026", action: "Item Stored", item: '65" TV #004', type: "in", tx: "1mNp...6Cxd" },
                { date: "Apr 15, 2026", action: "Pickup Scheduled", item: "Box of Books #002", type: "schedule", tx: "—" },
              ].map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: "rgba(245,145,55,0.08)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{
                        background: event.type === "mint" ? "rgba(255,239,70,0.15)" : event.type === "schedule" ? "rgba(235,114,154,0.15)" : "rgba(52,211,153,0.15)",
                      }}
                    >
                      {event.type === "mint" ? "🪙" : event.type === "schedule" ? "📅" : "📦"}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#F8F2E6" }}>
                        {event.action}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>
                        {event.item}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono" style={{ color: "rgba(248,242,230,0.4)" }}>
                      {event.tx}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(248,242,230,0.35)" }}>
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions bar */}
        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 p-6 rounded-xl"
          style={{ background: "rgba(45,27,61,0.4)", border: "1px solid rgba(245,145,55,0.12)" }}
        >
          <div className="flex-1">
            <h4
              className="font-bold text-sm mb-1"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              Quick Actions
            </h4>
            <p className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>
              Manage your storage mission from here.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/schedule" className="btn-primary py-2" style={{ fontSize: "0.75rem" }}>
              📅 New Pickup
            </Link>
            <Link href="/marketplace" className="btn-secondary py-2" style={{ fontSize: "0.75rem" }}>
              🏷️ Marketplace
            </Link>
            <Link href="/intake" className="btn-secondary py-2" style={{ fontSize: "0.75rem" }}>
              🧾 Staff Intake
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
