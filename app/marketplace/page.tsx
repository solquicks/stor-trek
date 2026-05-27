"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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

/* ── Mock Listings ── */
const listings = [
  {
    id: "0142",
    name: "Mid-Century Sofa",
    emoji: "🛋️",
    category: "Furniture",
    size: "Large",
    priceSol: 1.8,
    priceUsd: 270,
    daysListed: 3,
    seller: "7xKzMfPa3Q8Wr...4Fmn",
    condition: "Good",
    description: "Walnut-frame mid-century modern sofa. Minor scuff on left armrest. NFT includes all storage rights.",
    featured: true,
  },
  {
    id: "0089",
    name: "Vintage Record Collection",
    emoji: "🎵",
    category: "Art & Collectibles",
    size: "Small",
    priceSol: 3.2,
    priceUsd: 480,
    daysListed: 7,
    seller: "3pQrBtLm2Y7Xz...8Wvt",
    condition: "Excellent",
    description: "42 vinyl records from the 70s & 80s. Original sleeves. Includes Beatles, Zeppelin, and more.",
    featured: false,
  },
  {
    id: "0251",
    name: 'LG 65" OLED TV',
    emoji: "📺",
    category: "Electronics",
    size: "Large",
    priceSol: 2.5,
    priceUsd: 375,
    daysListed: 1,
    seller: "9aRsTkUv4B5Cw...2Yhn",
    condition: "Like New",
    description: "LG C3 65-inch OLED. Bought in 2023. Original box and all accessories included.",
    featured: true,
  },
  {
    id: "0317",
    name: "Herman Miller Chair",
    emoji: "🪑",
    category: "Furniture",
    size: "Medium",
    priceSol: 4.1,
    priceUsd: 615,
    daysListed: 12,
    seller: "1mNpQkRs3A6Bd...6Cxd",
    condition: "Good",
    description: "Aeron chair, size B. Fully adjustable lumbar, armrests, and tilt. Minor seat foam wear.",
    featured: false,
  },
  {
    id: "0408",
    name: "Road Bicycle",
    emoji: "🚴",
    category: "Sports & Fitness",
    size: "Medium",
    priceSol: 1.4,
    priceUsd: 210,
    daysListed: 5,
    seller: "5fGhJkLm8N2Pp...3Qrs",
    condition: "Good",
    description: "Trek Domane SL5. Size 54cm. Recent tune-up. Stored with pedals off and tires aired.",
    featured: false,
  },
  {
    id: "0512",
    name: "Vintage Dresser",
    emoji: "🗄️",
    category: "Furniture",
    size: "Large",
    priceSol: 0.9,
    priceUsd: 135,
    daysListed: 18,
    seller: "2wXyZabc4D5Ef...7Ghi",
    condition: "Fair",
    description: "Art deco walnut dresser, 6 drawers. Some finish wear. Drawers slide smoothly.",
    featured: false,
  },
];

type FilterType = "All" | "Furniture" | "Electronics" | "Art & Collectibles" | "Sports & Fitness";
const filterTabs: FilterType[] = ["All", "Furniture", "Electronics", "Art & Collectibles", "Sports & Fitness"];

const sizeBadge = (size: string) => {
  if (size === "Large") return "badge-orange";
  if (size === "Medium") return "badge-yellow";
  return "badge-green";
};

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [boughtId, setBoughtId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "price_asc" | "price_desc">("recent");

  const filtered = listings.filter(
    (l) => activeFilter === "All" || l.category === activeFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.priceSol - b.priceSol;
    if (sortBy === "price_desc") return b.priceSol - a.priceSol;
    return a.daysListed - b.daysListed;
  });

  const handleBuy = async (id: string) => {
    setBuyingId(id);
    await new Promise((r) => setTimeout(r, 1800));
    setBuyingId(null);
    setBoughtId(id);
  };

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="badge-orange mb-3 inline-block">Live Marketplace</span>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              Storage NFT Marketplace
            </h1>
            <p className="text-sm mt-2" style={{ color: "rgba(248,242,230,0.5)" }}>
              Buy storage NFTs to inherit physical custody. Transfer, sell, or redeem anytime.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(45,27,61,0.5)",
                border: "1px solid rgba(245,145,55,0.2)",
                color: "#F8F2E6",
                fontFamily: "var(--font-inter, Inter, sans-serif)",
              }}
            >
              <option value="recent" style={{ background: "#2D1B3D" }}>Sort: Recent</option>
              <option value="price_asc" style={{ background: "#2D1B3D" }}>Price: Low → High</option>
              <option value="price_desc" style={{ background: "#2D1B3D" }}>Price: High → Low</option>
            </select>

            <Link href="/intake" className="btn-primary py-2" style={{ fontSize: "0.75rem" }}>
              + List Item
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active Listings", value: listings.length, color: "#F59137" },
            { label: "Total Volume (SOL)", value: listings.reduce((s, l) => s + l.priceSol, 0).toFixed(1), color: "#FFEF46" },
            { label: "Avg Price (SOL)", value: (listings.reduce((s, l) => s + l.priceSol, 0) / listings.length).toFixed(2), color: "#EB729A" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center py-4">
              <div
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(248,242,230,0.5)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                background: activeFilter === tab ? "#F59137" : "rgba(45,27,61,0.5)",
                color: activeFilter === tab ? "#02050A" : "rgba(248,242,230,0.6)",
                border: activeFilter === tab ? "1px solid #F59137" : "1px solid rgba(245,145,55,0.2)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sorted.map((listing) => (
            <div
              key={listing.id}
              className="card flex flex-col gap-4 relative overflow-hidden"
              style={{
                borderColor: listing.featured ? "rgba(245,145,55,0.45)" : "rgba(245,145,55,0.15)",
                background: listing.featured
                  ? "linear-gradient(160deg, rgba(245,145,55,0.1), rgba(45,27,61,0.6))"
                  : undefined,
              }}
            >
              {listing.featured && (
                <div
                  className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                    background: "rgba(245,145,55,0.2)",
                    color: "#F59137",
                    border: "1px solid rgba(245,145,55,0.4)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  FEATURED
                </div>
              )}

              {/* Emoji + header */}
              <div className="flex items-start gap-3">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: "rgba(45,27,61,0.6)", border: "1px solid rgba(245,145,55,0.15)" }}
                >
                  {listing.emoji}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-yellow text-xs">NFT #{listing.id}</span>
                    <span className={sizeBadge(listing.size)}>{listing.size}</span>
                  </div>
                  <h3
                    className="font-bold text-base leading-tight truncate"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                  >
                    {listing.name}
                  </h3>
                  <p className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>
                    {listing.category} · {listing.condition}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(248,242,230,0.6)" }}>
                {listing.description}
              </p>

              {/* Price row */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(2,5,10,0.4)", border: "1px solid rgba(245,145,55,0.12)" }}
              >
                <div>
                  <div
                    className="text-2xl font-black"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
                  >
                    ◎ {listing.priceSol}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(248,242,230,0.4)" }}>
                    ≈ ${listing.priceUsd} USD
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: "rgba(248,242,230,0.4)" }}>
                    Listed {listing.daysListed}d ago
                  </div>
                  <div
                    className="text-xs font-mono truncate max-w-[120px]"
                    style={{ color: "rgba(248,242,230,0.3)" }}
                  >
                    {listing.seller.slice(0, 16)}...
                  </div>
                </div>
              </div>

              {/* Buy Now button */}
              {boughtId === listing.id ? (
                <div
                  className="flex items-center justify-center gap-2 py-3 rounded-lg"
                  style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}
                >
                  <span style={{ color: "#34d399" }}>✓</span>
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#34d399", fontSize: "0.75rem" }}
                  >
                    NFT Acquired!
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleBuy(listing.id)}
                  disabled={buyingId === listing.id}
                  className="btn-primary w-full py-3"
                  style={{ fontSize: "0.75rem" }}
                >
                  {buyingId === listing.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `🛒 Buy Now · ◎ ${listing.priceSol}`
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="card text-center py-20">
            <div className="text-5xl mb-4">🔭</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              No listings in this category
            </h3>
            <p className="text-sm" style={{ color: "rgba(248,242,230,0.5)" }}>
              Be the first to list an item in this category.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="btn-secondary mt-6 mx-auto"
            >
              View All Listings
            </button>
          </div>
        )}

        {/* CTA */}
        <div
          className="mt-12 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
          style={{
            background: "linear-gradient(135deg, rgba(45,27,61,0.8), rgba(2,5,10,0.9))",
            border: "1px solid rgba(245,145,55,0.2)",
          }}
        >
          <div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
            >
              Have Items in Storage?
            </h3>
            <p className="text-sm" style={{ color: "rgba(248,242,230,0.55)" }}>
              List your storage NFTs here and get paid instantly when someone buys.
              They inherit the storage contract — you get paid in SOL.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0 flex-wrap justify-center">
            <Link href="/dashboard" className="btn-secondary py-2" style={{ fontSize: "0.75rem" }}>
              📦 My Storage
            </Link>
            <Link href="/intake" className="btn-primary py-2" style={{ fontSize: "0.75rem" }}>
              + List New Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
