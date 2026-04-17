import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

/* ── Constants ── */
const TOTAL_STEPS = 5;

const CATEGORIES = [
  { name: "Furniture", emoji: "🛋️", base: 5000 },
  { name: "Electronics", emoji: "📺", base: 6000 },
  { name: "Appliances", emoji: "🍳", base: 4000 },
  { name: "Kitchen", emoji: "🥘", base: 1800 },
  { name: "Bedroom", emoji: "🛏️", base: 4500 },
  { name: "Clothing", emoji: "👗", base: 600 },
  { name: "Books", emoji: "📚", base: 300 },
  { name: "Decor", emoji: "🖼️", base: 1200 },
  { name: "Sports", emoji: "⚽", base: 1000 },
  { name: "Other", emoji: "📦", base: 500 },
];

const CONDITIONS = [
  { label: "New", mult: 1.0, color: "bg-green-100 text-green-700 border-green-200" },
  { label: "Good", mult: 0.75, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Used", mult: 0.5, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { label: "For Parts", mult: 0.2, color: "bg-red-100 text-red-700 border-red-200" },
];

const AGE_OPTIONS = [
  { label: "< 1 year", mult: 1.0 },
  { label: "1–2 years", mult: 0.85 },
  { label: "3–5 years", mult: 0.65 },
  { label: "5+ years", mult: 0.45 },
];

const SELLING_MODELS = [
  {
    id: "Direct Resale",
    icon: "🏷️",
    title: "Direct Resale",
    badge: "Full control",
    badgeColor: "bg-blue-100 text-blue-700",
    desc: "You list, we connect you with buyers. Handle everything yourself.",
    eta: "3–7 days",
    payout: "Full price",
  },
  {
    id: "Managed Consignment",
    icon: "🤝",
    title: "Managed Consignment",
    badge: "Hands-free",
    badgeColor: "bg-purple-100 text-purple-700",
    desc: "Our team handles listing, negotiation, and sale on your behalf.",
    eta: "1–4 days",
    payout: "Price − 12% fee",
  },
  {
    id: "Instant Cashout",
    icon: "⚡",
    title: "Instant Cashout",
    badge: "Fastest",
    badgeColor: "bg-amber-100 text-amber-700",
    desc: "Get paid immediately. We buy at 70–80% of AI estimate. Move in 24h.",
    eta: "24 hours",
    payout: "70–80% of estimate",
  },
];

const BUNDLE_TYPES = [
  "1BHK Setup", "Kitchen Essentials", "Bedroom Combo",
  "Living Room", "Full Home Setup", "Custom Bundle",
];

const CITIES = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Other"];

/* ── AI Price engine ── */
function aiEstimate(items, sellingModel) {
  let total = 0;
  items.forEach(it => {
    const cat  = CATEGORIES.find(c => c.name === it.category) || CATEGORIES[9];
    const cond = CONDITIONS.find(c => c.label === it.condition) || CONDITIONS[1];
    const age  = AGE_OPTIONS.find(a => a.label === it.age) || AGE_OPTIONS[0];
    total += cat.base * cond.mult * age.mult;
  });
  // Bundle discount: 10% for 3+, 15% for 5+
  const bundleDisc = items.length >= 5 ? 0.85 : items.length >= 3 ? 0.9 : 1;
  const modelDisc  = sellingModel === "Instant Cashout" ? 0.75 : sellingModel === "Managed Consignment" ? 0.88 : 1;
  return {
    gross:   Math.round(total),
    bundleDiscount: items.length >= 3 ? (items.length >= 5 ? 15 : 10) : 0,
    net:     Math.round(total * bundleDisc * modelDisc),
    perItem: items.map(it => {
      const cat  = CATEGORIES.find(c => c.name === it.category) || CATEGORIES[9];
      const cond = CONDITIONS.find(c => c.label === it.condition) || CONDITIONS[1];
      const age  = AGE_OPTIONS.find(a => a.label === it.age) || AGE_OPTIONS[0];
      return Math.round(cat.base * cond.mult * age.mult);
    }),
  };
}

/* ── Step indicator ── */
function StepBar({ current }) {
  const labels = ["Upload", "Items", "Sell Model", "AI Price", "Pickup"];
  return (
    <div className="flex items-center gap-0 mb-10">
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center min-w-[56px]">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                done    ? "bg-indigo-600 text-white"
                : active ? "bg-indigo-600 text-white ring-4 ring-indigo-100 pulse-ring"
                : "bg-gray-100 text-gray-400"
              }`}>
                {done ? "✓" : step}
              </div>
              <span className={`text-[10px] mt-1.5 font-semibold hidden sm:block ${active ? "text-indigo-600" : done ? "text-gray-500" : "text-gray-300"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 transition-all duration-500 ${done ? "bg-indigo-500" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Image slot ── */
function ImageSlot({ preview, onChange, label }) {
  return (
    <label className="cursor-pointer block">
      <div className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-200 ${
        preview ? "border-indigo-300 bg-white" : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30"
      }`}>
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-1">
            <span className="text-3xl">+</span>
            <span className="text-xs font-medium">{label || "Add photo"}</span>
          </div>
        )}
      </div>
      <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
    </label>
  );
}

/* ─────────── MAIN COMPONENT ─────────── */
export default function SellFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isWholeMode = searchParams.get("mode") === "whole";

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* Step 1 */
  const [wholeSetup,  setWholeSetup]  = useState(isWholeMode);
  const [images,      setImages]      = useState([null, null, null, null]);
  const [previews,    setPreviews]    = useState([null, null, null, null]);
  const [title,       setTitle]       = useState("");
  const [bundleType,  setBundleType]  = useState("Custom Bundle");
  const [city,        setCity]        = useState("Delhi");

  /* Step 2 */
  const [items, setItems] = useState([
    { name: "", category: "Furniture", condition: "Good", age: "< 1 year" },
  ]);

  /* Step 3 */
  const [sellingModel, setSellingModel] = useState("Direct Resale");

  /* Step 4 — AI price */
  const estimate = aiEstimate(items.filter(i => i.name.trim()), sellingModel);

  /* Step 5 */
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  /* ── Auto-populate items for whole setup ── */
  useEffect(() => {
    if (wholeSetup && items.length === 1 && !items[0].name) {
      setItems([
        { name: "Sofa", category: "Furniture", condition: "Good", age: "1–2 years" },
        { name: "Bed Frame + Mattress", category: "Bedroom", condition: "Good", age: "1–2 years" },
        { name: "Refrigerator", category: "Appliances", condition: "Good", age: "3–5 years" },
        { name: "Washing Machine", category: "Appliances", condition: "Good", age: "3–5 years" },
        { name: "TV + Stand", category: "Electronics", condition: "Good", age: "1–2 years" },
        { name: "Dining Table + Chairs", category: "Furniture", condition: "Good", age: "1–2 years" },
        { name: "Kitchen Appliances", category: "Kitchen", condition: "Good", age: "1–2 years" },
      ]);
      setTitle("Full Home Setup");
      setBundleType("Full Home Setup");
    }
  }, [wholeSetup]);

  /* ── Image handler ── */
  const handleImg = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const p = [...previews]; p[idx] = reader.result; setPreviews(p);
      const im = [...images]; im[idx] = reader.result; setImages(im);
    };
    reader.readAsDataURL(file);
  };

  /* ── Item handlers ── */
  const updateItem = (i, field, val) => {
    const arr = [...items]; arr[i] = { ...arr[i], [field]: val }; setItems(arr);
  };
  const addItem = () => setItems([...items, { name: "", category: "Furniture", condition: "Good", age: "< 1 year" }]);
  const removeItem = i => setItems(items.filter((_, idx) => idx !== i));

  /* ── Nav ── */
  const next = () => { setError(""); setStep(s => s + 1); window.scrollTo(0, 0); };
  const back = () => { setError(""); setStep(s => s - 1); window.scrollTo(0, 0); };

  const validate = () => {
    if (step === 1 && !title.trim()) { setError("Please enter a title for your listing."); return false; }
    if (step === 2 && !items.some(i => i.name.trim())) { setError("Add at least one item."); return false; }
    if (step === 5 && !pickupDate) { setError("Please select a pickup date."); return false; }
    return true;
  };

  const handleNext = () => { if (validate()) next(); };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    setLoading(true);

    const filledItems = items.filter(i => i.name.trim());
    const itemEst = aiEstimate(filledItems, sellingModel);
    const comboData = {
      title: wholeSetup ? (title || "Full Home Setup") : title,
      price: itemEst.net,
      estimatedPrice: itemEst.net,
      description: `${sellingModel} · ${bundleType} · ${city}`,
      city,
      bundleType,
      sellingModel,
      discountPercent: itemEst.bundleDiscount,
      isWholeSetup: wholeSetup,
      pickupDate,
      pickupTime,
      items: filledItems.map((it, idx) => ({
        name: it.name,
        category: it.category,
        condition: it.condition,
        age: it.age,
        image: images[idx] || images[0] || "",
        estimatedItemPrice: itemEst.perItem[idx] || 0,
      })),
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/combos",
        comboData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (pickupDate) {
        await axios.post(
          "http://localhost:5000/api/orders/place",
          {
            comboId: res.data._id,
            deliveryAddress: city,
            pickupDate,
            pickupTime,
            sellingModel,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => {});
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <span className="text-3xl block mb-2">{wholeSetup ? "🏠" : "📦"}</span>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {wholeSetup ? "Sell Your Entire Home" : "List Your Items"}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Complete in {TOTAL_STEPS} steps · Takes under 3 minutes</p>
        </div>

        <StepBar current={step} />

        {/* ─── Card wrapper ─── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 slide-up">

          {/* ═══════════ STEP 1: Upload & Setup ═══════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Your Listing</h2>
                <p className="text-sm text-gray-400">Give your setup a name and upload some photos.</p>
              </div>

              {/* Whole Setup toggle */}
              <div
                onClick={() => setWholeSetup(!wholeSetup)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  wholeSetup ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-bold text-gray-900">Sell My Whole Setup ⚡</p>
                    <p className="text-xs text-gray-500 mt-0.5">Auto-fill common home items. Maximum speed.</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${wholeSetup ? "bg-indigo-600" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${wholeSetup ? "translate-x-5" : ""}`} />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Listing Title *</label>
                <input
                  type="text" placeholder='e.g. "2BHK Full Setup — South Delhi"'
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>

              {/* Bundle Type + City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Bundle Type</label>
                  <select value={bundleType} onChange={e => setBundleType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {BUNDLE_TYPES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">City</label>
                  <select value={city} onChange={e => setCity(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Photos (optional)</label>
                <div className="grid grid-cols-4 gap-3">
                  {previews.map((p, i) => (
                    <ImageSlot key={i} preview={p} onChange={e => handleImg(i, e)} label={i === 0 ? "Main" : `Photo ${i+1}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Better photos = faster sale. JPG/PNG up to 5MB.</p>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 2: Items ═══════════ */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Your Items</h2>
                  <p className="text-sm text-gray-400">
                    {wholeSetup ? "We pre-filled common items. Edit as needed." : "Add items one by one."}
                  </p>
                </div>
                <button onClick={addItem} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1">
                  + Add item
                </button>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group">
                    {/* Item name */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">
                        {CATEGORIES.find(c => c.name === item.category)?.emoji || "📦"}
                      </span>
                      <input
                        type="text" placeholder="Item name (e.g. 3-seater sofa)"
                        value={item.name} onChange={e => updateItem(idx, "name", e.target.value)}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-400 transition text-lg opacity-0 group-hover:opacity-100">
                          ×
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Category */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 mb-1">Category</p>
                        <select value={item.category} onChange={e => updateItem(idx, "category", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                          {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      {/* Condition */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 mb-1">Condition</p>
                        <select value={item.condition} onChange={e => updateItem(idx, "condition", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                          {CONDITIONS.map(c => <option key={c.label}>{c.label}</option>)}
                        </select>
                      </div>
                      {/* Age */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 mb-1">Age</p>
                        <select value={item.age} onChange={e => updateItem(idx, "age", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                          {AGE_OPTIONS.map(a => <option key={a.label}>{a.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live count */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>{items.filter(i => i.name.trim()).length} item(s) added</span>
                {items.filter(i => i.name.trim()).length >= 3 && (
                  <span className="text-green-600 font-semibold">✓ Bundle discount will apply</span>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ STEP 3: Selling Model ═══════════ */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Choose How to Sell</h2>
                <p className="text-sm text-gray-400">Pick the model that matches your timeline and needs.</p>
              </div>

              {SELLING_MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSellingModel(m.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    sellingModel === m.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">{m.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`}>{m.badge}</span>
                        {sellingModel === m.id && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{m.desc}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-gray-400">⏱ {m.eta}</span>
                        <span className="text-gray-400">💰 {m.payout}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ═══════════ STEP 4: AI Price Estimate ═══════════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">AI Price Estimate</h2>
                <p className="text-sm text-gray-400">Based on category, condition, age, and market data.</p>
              </div>

              {/* Main estimate */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-7 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <p className="text-indigo-200 text-sm font-semibold mb-1 uppercase tracking-wide">🤖 AI Estimated Value</p>
                <p className="text-6xl font-extrabold mb-2">₹{estimate.net.toLocaleString()}</p>
                {estimate.bundleDiscount > 0 && (
                  <p className="text-indigo-200 text-sm">
                    Bundle discount of <strong className="text-white">{estimate.bundleDiscount}%</strong> applied →
                    Gross was ₹{estimate.gross.toLocaleString()}
                  </p>
                )}
                <p className="text-indigo-300 text-xs mt-2">Final amount confirmed post-inspection</p>
              </div>

              {/* Per-item breakdown */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-700 mb-3">Breakdown by Item</p>
                {items.filter(i => i.name.trim()).map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-lg">{CATEGORIES.find(c => c.name === it.category)?.emoji || "📦"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{it.name}</p>
                      <p className="text-xs text-gray-400">{it.category} · {it.condition} · {it.age}</p>
                    </div>
                    <p className="text-sm font-bold text-indigo-600">₹{(estimate.perItem[idx] || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Selling model</span><span className="font-semibold">{sellingModel}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Gross value</span><span className="font-semibold">₹{estimate.gross.toLocaleString()}</span></div>
                {estimate.bundleDiscount > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500">Bundle savings</span><span className="font-semibold text-green-600">−{estimate.bundleDiscount}%</span></div>
                )}
                {sellingModel !== "Direct Resale" && (
                  <div className="flex justify-between"><span className="text-gray-500">Platform adjustment</span>
                    <span className="font-semibold text-yellow-600">{sellingModel === "Instant Cashout" ? "−25%" : "−12%"}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-bold text-gray-900">You receive</span>
                  <span className="font-extrabold text-indigo-600 text-base">₹{estimate.net.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center bg-amber-50 border border-amber-100 rounded-xl p-3">
                ⚠️ Price is an AI-based estimate. Actual amount may vary by ±10% after physical inspection.
              </p>
            </div>
          )}

          {/* ═══════════ STEP 5: Schedule Pickup ═══════════ */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Schedule Pickup</h2>
                <p className="text-sm text-gray-400">Our team will arrive at your location on the selected date.</p>
              </div>

              {/* Confirm summary */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                  <span>📋</span> Listing Summary
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-gray-400 text-xs">Title</p><p className="font-medium text-gray-800">{title || "—"}</p></div>
                  <div><p className="text-gray-400 text-xs">City</p><p className="font-medium text-gray-800">{city}</p></div>
                  <div><p className="text-gray-400 text-xs">Bundle type</p><p className="font-medium text-gray-800">{bundleType}</p></div>
                  <div><p className="text-gray-400 text-xs">Selling model</p><p className="font-medium text-gray-800">{sellingModel}</p></div>
                  <div><p className="text-gray-400 text-xs">Items</p><p className="font-medium text-gray-800">{items.filter(i => i.name.trim()).length}</p></div>
                  <div><p className="text-gray-400 text-xs">AI Estimate</p><p className="font-bold text-indigo-600">₹{estimate.net.toLocaleString()}</p></div>
                </div>
              </div>

              {/* Date / Time */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-4">📅 Pickup Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pickup Date *</label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setPickupDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Preferred Slot</label>
                    <select value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="">Any time</option>
                      <option>9 AM – 12 PM</option>
                      <option>12 PM – 3 PM</option>
                      <option>3 PM – 6 PM</option>
                      <option>6 PM – 9 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-green-700">
                <p className="font-semibold mb-1">✅ What happens next</p>
                <ol className="space-y-1 text-xs text-green-600 list-decimal list-inside">
                  <li>Our team confirms your slot via call/SMS</li>
                  <li>We arrive, inspect, and collect items</li>
                  <li>Your listing goes live on Reloc</li>
                  <li>Payment released upon buyer confirmation</li>
                </ol>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={back} className="text-sm font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition">
                ← Back
              </button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="px-7 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all duration-200 disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Confirming…</>
                ) : "Confirm & Exit ✓"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your items are inspected before payment is released. Safe &amp; secured.
        </p>
      </div>
    </div>
  );
}
