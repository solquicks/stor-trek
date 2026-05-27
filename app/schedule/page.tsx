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

/* ── Mock stored items ── */
const storedItems = [
  { id: "001", name: "Sofa", emoji: "🛋️", size: "Large", weeklyRate: 18 },
  { id: "002", name: "Box of Books", emoji: "📚", size: "Small", weeklyRate: 4 },
  { id: "003", name: "Gaming Chair", emoji: "🎮", size: "Medium", weeklyRate: 10 },
  { id: "004", name: '65" TV', emoji: "📺", size: "Large", weeklyRate: 16 },
];

/* ── Time windows ── */
const timeWindows = [
  { id: "morning", label: "Morning", time: "8:00 AM – 12:00 PM", icon: "🌅", desc: "Early crew dispatch" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM – 5:00 PM", icon: "☀️", desc: "Peak hours" },
  { id: "evening", label: "Evening", time: "5:00 PM – 8:00 PM", icon: "🌆", desc: "After-work window" },
];

/* ── Generate next 7 days ── */
function getNext7Days() {
  const days = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(d: Date) {
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

const STEPS = [
  { n: 1, label: "Select Items" },
  { n: 2, label: "Choose Date" },
  { n: 3, label: "Time Window" },
];

export default function SchedulePage() {
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmRef] = useState(() =>
    "ST-" + Math.random().toString(36).toUpperCase().slice(2, 10)
  );

  const next7Days = getNext7Days();

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setConfirmed(true);
  };

  const canProceedStep1 = selectedItems.length > 0;
  const canProceedStep2 = selectedDate !== null;
  const canConfirm = selectedTime !== null && address.trim().length > 4;

  const sizeBadge = (size: string) => {
    if (size === "Large") return "badge-orange";
    if (size === "Medium") return "badge-yellow";
    return "badge-green";
  };

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 pt-24">

        {/* Header */}
        <div className="mb-10">
          <span className="badge-yellow mb-3 inline-block">Retrieval Scheduling</span>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
          >
            Schedule a Pickup
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(248,242,230,0.5)" }}>
            Select the items you want delivered, choose a date, and pick a time window.
            We&apos;ll bring your items right to your door.
          </p>
        </div>

        {confirmed ? (
          /* ── Confirmation ── */
          <div
            className="card text-center py-14 flex flex-col items-center gap-6"
            style={{
              background: "linear-gradient(160deg, rgba(245,145,55,0.1), rgba(45,27,61,0.7))",
              borderColor: "rgba(245,145,55,0.4)",
            }}
          >
            <div className="text-6xl">🚀</div>
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137" }}
              >
                Pickup Confirmed!
              </h2>
              <p style={{ color: "rgba(248,242,230,0.7)" }}>
                Your storage crew has been dispatched.
              </p>
            </div>

            <div
              className="w-full rounded-xl p-6 text-left flex flex-col gap-4"
              style={{ background: "rgba(45,27,61,0.6)", border: "1px solid rgba(245,145,55,0.2)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>Confirmation #</span>
                <span
                  className="font-bold text-sm"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#FFEF46" }}
                >
                  {confirmRef}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>Date</span>
                <span className="text-sm font-medium" style={{ color: "#F8F2E6" }}>
                  {selectedDate ? formatDate(selectedDate) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>Time Window</span>
                <span className="text-sm font-medium" style={{ color: "#F8F2E6" }}>
                  {timeWindows.find((t) => t.id === selectedTime)?.time ?? "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs flex-shrink-0" style={{ color: "rgba(248,242,230,0.5)" }}>Items</span>
                <span className="text-sm text-right" style={{ color: "#F8F2E6" }}>
                  {selectedItems
                    .map((id) => storedItems.find((i) => i.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs flex-shrink-0" style={{ color: "rgba(248,242,230,0.5)" }}>Delivery Address</span>
                <span className="text-sm text-right" style={{ color: "#F8F2E6" }}>{address}</span>
              </div>
            </div>

            <p className="text-sm" style={{ color: "rgba(248,242,230,0.5)" }}>
              You&apos;ll receive a confirmation text 24 hours before your delivery window.
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => {
                  setConfirmed(false);
                  setStep(1);
                  setSelectedItems([]);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setAddress("");
                  setNotes("");
                }}
                className="btn-primary"
              >
                📅 Schedule Another
              </button>
              <Link href="/dashboard" className="btn-secondary">
                📦 Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── Step Indicator ── */}
            <div className="flex items-center gap-0 mb-10">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => {
                        if (s.n < step) setStep(s.n);
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                          background: step === s.n ? "#F59137" : step > s.n ? "#34d399" : "rgba(45,27,61,0.6)",
                          color: step >= s.n ? "#02050A" : "rgba(248,242,230,0.4)",
                          border: step < s.n ? "1px solid rgba(245,145,55,0.2)" : "none",
                        }}
                      >
                        {step > s.n ? "✓" : s.n}
                      </div>
                      <span
                        className="text-xs hidden sm:block"
                        style={{
                          fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                          color: step === s.n ? "#F59137" : step > s.n ? "#34d399" : "rgba(248,242,230,0.35)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {s.label}
                      </span>
                    </button>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-2 transition-all duration-300"
                      style={{
                        background: step > s.n
                          ? "#34d399"
                          : "rgba(245,145,55,0.15)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ── STEP 1: Item Selection ── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h2
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                >
                  Which items do you want back?
                </h2>
                {storedItems.map((item) => {
                  const checked = selectedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className="w-full text-left transition-all duration-200"
                    >
                      <div
                        className="flex items-center gap-4 p-4 rounded-xl"
                        style={{
                          background: checked ? "rgba(245,145,55,0.1)" : "rgba(45,27,61,0.45)",
                          border: `1.5px solid ${checked ? "rgba(245,145,55,0.6)" : "rgba(245,145,55,0.12)"}`,
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            background: checked ? "#F59137" : "transparent",
                            border: checked ? "none" : "1.5px solid rgba(245,145,55,0.4)",
                          }}
                        >
                          {checked && <span className="text-xs font-bold" style={{ color: "#02050A" }}>✓</span>}
                        </div>

                        <span className="text-2xl">{item.emoji}</span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="font-semibold text-sm"
                              style={{ color: checked ? "#F59137" : "#F8F2E6" }}
                            >
                              {item.name}
                            </span>
                            <span className="badge-orange text-xs">#{item.id}</span>
                            <span className={sizeBadge(item.size)}>{item.size}</span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(248,242,230,0.45)" }}>
                            ${item.weeklyRate}/week storage fee
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-primary mt-4 py-4"
                  style={{ opacity: canProceedStep1 ? 1 : 0.4, cursor: canProceedStep1 ? "pointer" : "not-allowed" }}
                >
                  Continue — Choose Date →
                </button>
              </div>
            )}

            {/* ── STEP 2: Date Grid ── */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                >
                  When should we deliver?
                </h2>
                <p className="text-sm mb-4" style={{ color: "rgba(248,242,230,0.5)" }}>
                  Select your preferred delivery date. We operate 7 days a week.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {next7Days.map((day) => {
                    const isSelected = selectedDate?.toDateString() === day.toDateString();
                    return (
                      <button
                        key={day.toDateString()}
                        onClick={() => setSelectedDate(day)}
                        className="flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-200"
                        style={{
                          background: isSelected ? "#F59137" : "rgba(45,27,61,0.5)",
                          border: `1.5px solid ${isSelected ? "#F59137" : "rgba(245,145,55,0.15)"}`,
                        }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{
                            fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                            color: isSelected ? "#02050A" : "rgba(248,242,230,0.5)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {DAY_NAMES[day.getDay()].toUpperCase()}
                        </span>
                        <span
                          className="text-2xl font-black mt-1"
                          style={{
                            fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                            color: isSelected ? "#02050A" : "#F8F2E6",
                          }}
                        >
                          {day.getDate()}
                        </span>
                        <span
                          className="text-xs mt-0.5"
                          style={{ color: isSelected ? "rgba(2,5,10,0.7)" : "rgba(248,242,230,0.35)", fontSize: "0.65rem" }}
                        >
                          {MONTH_NAMES[day.getMonth()]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1 py-3"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="btn-primary flex-1 py-3"
                    style={{ opacity: canProceedStep2 ? 1 : 0.4, cursor: canProceedStep2 ? "pointer" : "not-allowed" }}
                  >
                    Choose Time →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Time Window + Address ── */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <h2
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F8F2E6" }}
                >
                  Choose Your Time Window
                </h2>

                <div className="flex flex-col gap-3">
                  {timeWindows.map((tw) => {
                    const isSelected = selectedTime === tw.id;
                    return (
                      <button
                        key={tw.id}
                        onClick={() => setSelectedTime(tw.id)}
                        className="w-full text-left"
                      >
                        <div
                          className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                          style={{
                            background: isSelected ? "rgba(245,145,55,0.12)" : "rgba(45,27,61,0.45)",
                            border: `1.5px solid ${isSelected ? "rgba(245,145,55,0.6)" : "rgba(245,145,55,0.12)"}`,
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                            style={{
                              background: isSelected ? "#F59137" : "transparent",
                              border: isSelected ? "none" : "1.5px solid rgba(245,145,55,0.4)",
                            }}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: "#02050A" }} />}
                          </div>
                          <span className="text-2xl">{tw.icon}</span>
                          <div>
                            <div
                              className="font-bold text-sm"
                              style={{
                                fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
                                color: isSelected ? "#F59137" : "#F8F2E6",
                              }}
                            >
                              {tw.label}
                            </div>
                            <div className="text-xs" style={{ color: "rgba(248,242,230,0.5)" }}>
                              {tw.time} · {tw.desc}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Delivery address */}
                <div>
                  <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                    Delivery Address <span style={{ color: "#EB729A" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="123 Space Station Blvd, Houston TX 77001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: "rgba(45,27,61,0.5)",
                      border: "1px solid rgba(245,145,55,0.2)",
                      color: "#F8F2E6",
                      fontFamily: "var(--font-inter, Inter, sans-serif)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                  />
                </div>

                <div>
                  <label className="text-xs mb-2 block" style={{ color: "rgba(248,242,230,0.6)" }}>
                    Delivery Notes (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gate code, apartment number, loading dock instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: "rgba(45,27,61,0.5)",
                      border: "1px solid rgba(245,145,55,0.2)",
                      color: "#F8F2E6",
                      fontFamily: "var(--font-inter, Inter, sans-serif)",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(245,145,55,0.2)")}
                  />
                </div>

                {/* Summary */}
                <div
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ background: "rgba(45,27,61,0.5)", border: "1px solid rgba(245,145,55,0.12)" }}
                >
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", color: "#F59137", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                  >
                    PICKUP SUMMARY
                  </p>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(248,242,230,0.5)" }}>Items</span>
                    <span style={{ color: "#F8F2E6" }}>
                      {selectedItems.map((id) => storedItems.find((i) => i.id === id)?.name).filter(Boolean).join(", ") || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(248,242,230,0.5)" }}>Date</span>
                    <span style={{ color: "#F8F2E6" }}>{selectedDate ? formatDate(selectedDate) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(248,242,230,0.5)" }}>Window</span>
                    <span style={{ color: "#F8F2E6" }}>
                      {timeWindows.find((t) => t.id === selectedTime)?.time ?? "Not selected"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">
                    ← Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!canConfirm || submitting}
                    className="btn-primary flex-1 py-3"
                    style={{ opacity: canConfirm ? 1 : 0.4, cursor: canConfirm ? "pointer" : "not-allowed" }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Confirming...
                      </span>
                    ) : (
                      "🚀 Confirm Pickup"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
