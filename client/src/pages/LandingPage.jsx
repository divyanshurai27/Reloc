import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

/* ── Differentiator cards data ── */
const DIFF_CARDS = [
  {
    icon: "🎯",
    title: "Relocation-Focused",
    desc: "Built exclusively for people moving cities — not a generic marketplace cluttered with random listings.",
    color: "from-blue-50 to-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: "🏠",
    title: "Bundle Home Listings",
    desc: "List your entire 1BHK, 2BHK, or just a room — as one transaction. No item-by-item chaos.",
    color: "from-purple-50 to-pink-50",
    border: "border-purple-100",
  },
  {
    icon: "🚐",
    title: "End-to-End Logistics",
    desc: "We pick up, inspect, store, and deliver. You just open the door and hand over the keys.",
    color: "from-teal-50 to-cyan-50",
    border: "border-teal-100",
  },
  {
    icon: "⚡",
    title: "1-Click Exit Selling",
    desc: "Tap 'Sell My Entire Home'. We handle valuation, listing, and sale. Done in minutes.",
    color: "from-amber-50 to-orange-50",
    border: "border-amber-100",
  },
  {
    icon: "💼",
    title: "Flexible Selling Models",
    desc: "Choose how you sell: Direct Resale, Managed Consignment, or Instant Cashout — on your terms.",
    color: "from-green-50 to-emerald-50",
    border: "border-green-100",
  },
  {
    icon: "🤖",
    title: "Smart AI Pricing",
    desc: "Our AI estimates fair prices based on item category, condition, and age. No more guessing.",
    color: "from-rose-50 to-pink-50",
    border: "border-rose-100",
  },
];

/* ── Process steps ── */
const STEPS = [
  { n: "01", icon: "📦", title: "List in minutes", desc: "Upload photos or tap 'Sell Whole Setup'. Add items individually or let us auto-detect." },
  { n: "02", icon: "🤖", title: "Get AI-priced", desc: "Instant price estimates based on category, condition, and market demand. Zero guesswork." },
  { n: "03", icon: "🚐", title: "We handle logistics", desc: "Flexible pickup scheduling. Our team arrives, inspects, and takes it from there." },
  { n: "04", icon: "💸", title: "Get paid", desc: "Payment released the moment your buyer confirms delivery. Fully secured." },
];

/* ── Mock bundle cards ── */
const BUNDLES = [
  {
    label: "1BHK Setup",
    emoji: "🛋️",
    items: ["Sofa", "Bed frame", "Wardrobe", "Study table"],
    price: 28000,
    discount: 15,
    city: "Delhi",
    color: "bg-indigo-50 border-indigo-100"
  },
  {
    label: "Kitchen Essentials",
    emoji: "🍳",
    items: ["Mixer grinder", "Gas stove", "Pots & pans", "Microwave"],
    price: 9500,
    discount: 12,
    city: "Bangalore",
    color: "bg-teal-50 border-teal-100"
  },
  {
    label: "Bedroom Combo",
    emoji: "🛏️",
    items: ["Double bed", "Mattress", "Wardrobe", "Side tables"],
    price: 18000,
    discount: 10,
    city: "Mumbai",
    color: "bg-purple-50 border-purple-100"
  },
];

/* ── Selling models ── */
const SELLING_MODELS = [
  {
    icon: "🏷️",
    title: "Direct Resale",
    desc: "List yourself. Buyer contacts you. Transfer handled on platform.",
    badge: "Full control",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    icon: "🤝",
    title: "Managed Consignment",
    desc: "We list, find buyers, and negotiate for you. You just approve the deal.",
    badge: "Hands-free",
    badgeColor: "bg-purple-100 text-purple-700"
  },
  {
    icon: "⚡",
    title: "Instant Cashout",
    desc: "Get paid immediately. We buy your items at guaranteed prices. Move in 24h.",
    badge: "Fastest",
    badgeColor: "bg-green-100 text-green-700"
  },
];

export default function LandingPage() {
  const [wholeSetup, setWholeSetup] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28">
        {/* Soft blobs */}
        <div className="pointer-events-none absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-indigo-50 blur-3xl opacity-70 -translate-y-1/3 translate-x-1/4" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-50 blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="slide-up">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Relocation Marketplace
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Moving out?<br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sell your entire
              </span><br />
              home in minutes.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              Reloc helps you sell, pickup, and deliver your entire household — stress free.
              Built for people on the move.
            </p>

            {/* "Sell Whole Setup" toggle */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl w-fit">
              <button
                onClick={() => setWholeSetup(!wholeSetup)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${wholeSetup ? "bg-indigo-600" : "bg-gray-300"}`}
                aria-label="Toggle whole setup"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${wholeSetup ? "translate-x-6" : ""}`} />
              </button>
              <div>
                <p className="text-sm font-bold text-gray-900">Sell My Whole Setup ⚡</p>
                <p className="text-xs text-gray-500">{wholeSetup ? "Enabled — we'll handle everything" : "Toggle to sell your entire home at once"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to={`/sell${wholeSetup ? "?mode=whole" : ""}`}
                id="hero-cta-sell"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Sell Everything ⚡
              </Link>
              <Link
                to="/combos"
                id="hero-cta-browse"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Setups →
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><span className="text-green-500 text-base">✓</span> Free to list</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500 text-base">✓</span> Pickup handled</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500 text-base">✓</span> Payment secured</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500 text-base">✓</span> AI-priced</span>
            </div>
          </div>

          {/* Right — UI preview */}
          <div className="hidden lg:block fade-in">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-gray-100 p-6 space-y-4">

                {/* AI price tag */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Setup Value</span>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">AI Estimated</span>
                </div>
                <div className="text-4xl font-extrabold text-indigo-600">₹42,500</div>

                {/* Items */}
                {[
                  { e: "🛋️", n: "3-seater Sofa", c: "Good", p: 8000 },
                  { e: "🛏️", n: "Queen Bed + Mattress", c: "New", p: 14000 },
                  { e: "🍳", n: "Kitchen Appliances", c: "Good", p: 6500 },
                  { e: "📺", n: "32\" LED TV", c: "Used", p: 4200 },
                ].map(item => (
                  <div key={item.n} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-xl">{item.e}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.n}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.c === "New" ? "bg-green-100 text-green-700" :
                        item.c === "Good" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                      }`}>{item.c}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">₹{item.p.toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Bundle discount</span>
                  <span className="text-sm font-bold text-green-600">−15% applied</span>
                </div>

                <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">
                  Confirm & Exit ✓
                </button>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ⚡ Instant Cashout
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 text-xs font-semibold px-3 py-2 rounded-xl shadow-md text-gray-700">
                🚐 Pickup in 24h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── WHY RELOC IS DIFFERENT ─────────── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Why Reloc</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Why Reloc is Different
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-lg">
              This isn't OLX. It's a focused tool built for one thing: helping people relocate faster.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFF_CARDS.map(card => (
              <div
                key={card.title}
                className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── SELLING MODELS ─────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Flexible Options</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Choose How You Sell</h2>
            <p className="text-gray-500 max-w-md mx-auto">Three models. Pick the one that matches your timeline and needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {SELLING_MODELS.map((m, i) => (
              <div
                key={m.title}
                className={`relative rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  i === 2 ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100" : "border-gray-100 bg-white hover:border-indigo-200"
                }`}
              >
                {i === 2 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <div className="text-4xl mb-4">{m.icon}</div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block ${m.badgeColor}`}>{m.badge}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{m.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{m.desc}</p>
                <Link
                  to="/sell"
                  className={`block text-center py-2.5 rounded-xl text-sm font-bold transition ${
                    i === 2
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Start with this →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Simple</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Done in 4 Steps</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-indigo-100" />
                )}
                <div className="relative inline-flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-3xl mb-4 hover:shadow-lg transition">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-indigo-400 mb-1">{step.n}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[160px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── BUNDLE SHOWCASE ─────────── */}
      <section id="bundles" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Bundle Deals</p>
              <h2 className="text-4xl font-extrabold text-gray-900">Browse Home Setups</h2>
              <p className="text-gray-500 mt-2">Curated bundles from real movers. Save more, stress less.</p>
            </div>
            <Link to="/combos" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap">
              View all setups →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {BUNDLES.map(b => (
              <div key={b.label} className={`rounded-3xl border p-6 ${b.color} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-3xl block mb-2">{b.emoji}</span>
                    <h3 className="font-bold text-gray-900 text-lg">{b.label}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {b.city}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    −{b.discount}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {b.items.map(it => (
                    <span key={it} className="text-xs bg-white/80 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                      {it}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 line-through">₹{Math.round(b.price / (1 - b.discount / 100)).toLocaleString()}</p>
                    <p className="text-2xl font-extrabold text-indigo-600">₹{b.price.toLocaleString()}</p>
                  </div>
                  <Link to="/combos" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">
                    View deal →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA BAND ─────────── */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Ready to move on?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of movers who've sold their homes stress-free.
            List in minutes, get paid in days.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/sell"
              className="px-8 py-4 bg-white text-indigo-700 font-extrabold rounded-2xl hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200 shadow-lg text-base"
            >
              Sell My Entire Home ⚡
            </Link>
            <Link
              to="/signup"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 border border-white/20 text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="bg-gray-950 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-white font-bold text-xl">Reloc</span>
              </div>
              <p className="text-sm leading-relaxed">The only marketplace built exclusively for people relocating cities.</p>
            </div>

            {/* Links */}
            <div>
              <p className="text-white text-sm font-semibold mb-4">Sell</p>
              <nav className="space-y-2 text-sm">
                <Link to="/sell" className="block hover:text-white transition">Sell Everything</Link>
                <Link to="/sell" className="block hover:text-white transition">Create Bundle</Link>
                <Link to="/create-combo" className="block hover:text-white transition">Manual Listing</Link>
              </nav>
            </div>

            <div>
              <p className="text-white text-sm font-semibold mb-4">Buy</p>
              <nav className="space-y-2 text-sm">
                <Link to="/combos" className="block hover:text-white transition">Browse Setups</Link>
                <Link to="/combos" className="block hover:text-white transition">1BHK Bundles</Link>
                <Link to="/combos" className="block hover:text-white transition">Kitchen Essentials</Link>
              </nav>
            </div>

            <div>
              <p className="text-white text-sm font-semibold mb-4">Account</p>
              <nav className="space-y-2 text-sm">
                <Link to="/login" className="block hover:text-white transition">Login</Link>
                <Link to="/signup" className="block hover:text-white transition">Sign Up</Link>
                <Link to="/dashboard" className="block hover:text-white transition">Dashboard</Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} Reloc. All rights reserved.</p>
            <p>Built for movers. Not everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}