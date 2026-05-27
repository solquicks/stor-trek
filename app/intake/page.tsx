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

const categories = [
  "Furniture",
  "Electronics",
  "Clothing & Textiles",
  "Books & Media",
  "Sports & Fitness",
  "Appliances",
  "Art & Collectibles",
  "Boxes & Bins",
  "Outdoor & Garden",
  "Other",
];

const sizes = [
  { value: "xs", label: "XS — Envelope/small box", desc: "Up to 1 cubic ft" },
  { value: "s", label: "S — Standard box", desc: "1–3 cubic ft" },
  { value: "m", label: "M — Medium item", desc: "3–10 cubic ft" },
  { value: "l", label: "L — Large item", desc: "10–30 cubic ft" },
  { value: "xl", label: "XL — Oversized / Furniture", desc: "30+ cubic ft" },
];

function generateNftNumber() {
  return String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0");
}

function generateTxHash() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
  return Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function IntakePage() {
  const [form, setForm] = useState({
    customerWallet: "",
    itemName: "",
    category: "",
    size: "",
    condition: "",
    estimatedValue: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoDragging, setPhotoDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mintInfo, setMintInfo] = useState({ nft: "", tx: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPhotoDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setPhotoFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate blockchain mint delay
    await new Promise((r) => setTimeout(r, 2200));
    setMintInfo({ nft: generateNftNumber(), tx: generateTxHash() });
    setLoading(false);
    setSuccess(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg text-sm outline-none transition-all";
  const inputStyle = {
    background: "rgba(45,27,61,0.5)",
    border: "1px solid rgba(245,145,55,0.2)",
    color: "#F8F2E6",
    fontFamily: "var(--font-inter, Inter, sans-serif)",
  };

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 pt-24">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-pink">Staff Only</span>
            <span className="badge-orange">Intake Tool</span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
          >
            Item Intake & NFT Mint
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(248,242,230,0.5)" }}>
            Catalogue incoming customer items and mint them as Solana NFTs. Each NFT represents
            proof of storage ownership on-chain.
          </p>
        </div>

        {success ? (
          /* ── Success State ── */
          <div
            className="card text-center py-12 flex flex-col items-center gap-6"
            style={{
              background: "linear-gradient(160deg, rgba(52,211,153,0.08), rgba(45,27,61,0.7))",
              borderColor: "rgba(52,211,153,0.3)",
            }}
          >
            <div className="text-6xl animate-bounce">🪙</div>
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#34d399" }}
              >
                NFT Minted Successfully!
              </h2>
              <p className="text-sm" style={{ color: "rgba(248,242,230,0.65)" }}>
                <strong style={{ color: "#F8F2E6" }}>{form.itemName || "Item"}</strong> has been catalogued and minted on Solana Devnet.
              </p>
            </div>

            <div
              className="w-full rounded-xl p-6 flex flex-col gap-4 text-left"
              style={{ background: "rgba(45,27,61,0.6)", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>NFT ID</span>
                <div className="flex items-center gap-2">
                  <span className="badge-yellow">STOR-TREK #{mintInfo.nft}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>Transaction Hash</span>
                <span
                  className="text-xs font-mono break-all"
                  style={{ color: "#FFEF46", background: "rgba(0,0,0,0.3)", padding: "8px", borderRadius: "6px" }}
                >
                  {mintInfo.tx}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { label: "Item", value: form.itemName || "—" },
                  { label: "Category", value: form.category || "—" },
                  { label: "Size", value: form.size.toUpperCase() || "—" },
                  { label: "Condition", value: form.condition || "—" },
                  { label: "Customer Wallet", value: form.customerWallet ? `${form.customerWallet.slice(0,8)}...` : "—" },
                  { label: "Est. Value", value: form.estimatedValue ? `$${form.estimatedValue}` : "—" },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-xs" style={{ color: "rgba(248,242,230,0.4)" }}>{row.label}</p>
                    <p className="text-sm font-medium" style={{ color: "#F8F2E6" }}>{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({ customerWallet: "", itemName: "", category: "", size: "", condition: "", estimatedValue: "" });
                  setPhotoFile(null);
                }}
                className="btn-primary"
              >
                🧾 Intake Another Item
              </button>
              <Link href="/dashboard" className="btn-secondary">
                📦 View Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* ── Intake Form ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Customer Wallet */}
            <div className="card flex flex-col gap-4">
              <h3
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
              >
                01 — Customer Info
              </h3>
              <div>
                <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                  Customer Wallet Address <span style={{ color: "#EB729A" }}>*</span>
                </label>
                <input
                  name="customerWallet"
                  value={form.customerWallet}
                  onChange={handleChange}
                  placeholder="e.g. 7xKzMfPa3Q...4Fmn (Solana public key)"
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                />
              </div>
            </div>

            {/* Item Details */}
            <div className="card flex flex-col gap-4">
              <h3
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
              >
                02 — Item Details
              </h3>

              <div>
                <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                  Item Name <span style={{ color: "#EB729A" }}>*</span>
                </label>
                <input
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  placeholder="e.g. IKEA MALM Dresser, 65-inch Samsung TV..."
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                    Category <span style={{ color: "#EB729A" }}>*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c} value={c} style={{ background: "#2D1B3D" }}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                    Size <span style={{ color: "#EB729A" }}>*</span>
                  </label>
                  <select
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                  >
                    <option value="">Select size...</option>
                    {sizes.map((s) => (
                      <option key={s.value} value={s.value} style={{ background: "#2D1B3D" }}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                  Condition Notes
                </label>
                <textarea
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the item's condition: scratches, missing parts, original packaging, etc."
                  className={inputClass}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                />
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                  Estimated Value (USD)
                </label>
                <input
                  name="estimatedValue"
                  type="number"
                  value={form.estimatedValue}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  min="0"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="card flex flex-col gap-4">
              <h3
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
              >
                03 — Photo Documentation
              </h3>

              <div
                className="relative rounded-xl flex flex-col items-center justify-center gap-3 py-12 px-6 text-center cursor-pointer transition-all duration-200"
                style={{
                  border: `2px dashed ${photoDragging ? "rgba(245,145,55,0.8)" : "rgba(245,145,55,0.3)"}`,
                  background: photoDragging ? "rgba(245,145,55,0.06)" : "rgba(45,27,61,0.3)",
                }}
                onDragOver={(e) => { e.preventDefault(); setPhotoDragging(true); }}
                onDragLeave={() => setPhotoDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {photoFile ? (
                  <>
                    <div className="text-4xl">📸</div>
                    <p className="text-sm font-medium" style={{ color: "#34d399" }}>
                      {photoFile.name}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(248,242,230,0.4)" }}>
                      {(photoFile.size / 1024).toFixed(1)} KB · Click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl">📷</div>
                    <p className="text-sm font-medium" style={{ color: "#F8F2E6" }}>
                      Drop photo here or click to browse
                    </p>
                    <p className="text-xs" style={{ color: "rgba(248,242,230,0.4)" }}>
                      PNG, JPG, HEIC accepted · Max 10 MB
                    </p>
                  </>
                )}
              </div>
              <p className="text-xs" style={{ color: "rgba(248,242,230,0.35)" }}>
                Photos are stored off-chain (IPFS). The hash is embedded in the NFT metadata.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Minting NFT on Solana...
                </span>
              ) : (
                "🪙 Mint NFT & Begin Storage"
              )}
            </button>

            <p className="text-xs text-center" style={{ color: "rgba(248,242,230,0.3)" }}>
              This action mints an NFT on Solana Devnet. Gas fees are paid by Stor Trek.
              Customer receives the NFT in their connected wallet.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
