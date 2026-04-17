import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const BUNDLE_TYPES = [
  { label: "All", value: "" },
  { label: "🏠 Full Home", value: "Full Home Setup" },
  { label: "🛋️ 1BHK Setup", value: "1BHK Setup" },
  { label: "🛏️ Bedroom", value: "Bedroom Combo" },
  { label: "🍳 Kitchen", value: "Kitchen Essentials" },
  { label: "🛋️ Living Room", value: "Living Room" },
  { label: "📦 Custom", value: "Custom Bundle" },
];

const MODEL_COLORS = {
  "Direct Resale":       "bg-blue-100 text-blue-700",
  "Managed Consignment": "bg-purple-100 text-purple-700",
  "Instant Cashout":     "bg-amber-100 text-amber-700",
};

export default function ViewCombos() {
  const { city: cityParam } = useParams();
  const navigate = useNavigate();

  const [combos,      setCombos]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [citySearch,  setCitySearch]  = useState(cityParam || "");
  const [activeType,  setActiveType]  = useState("");

  const fetchCombos = async (city, bundleType) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city)       params.set("city",       city);
    if (bundleType) params.set("bundleType", bundleType);
    try {
      const res = await axios.get(`http://localhost:5000/api/combos${params.toString() ? `?${params}` : ""}`);
      setCombos(res.data);
    } catch {
      setCombos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCombos(cityParam, ""); }, [cityParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCombos(citySearch.trim() || undefined, activeType);
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
    fetchCombos(citySearch || undefined, type);
  };

  const displayedCombos = combos;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 fade-in">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            {cityParam ? `Setups in ${cityParam}` : "Browse Home Setups"}
          </h1>
          <p className="text-gray-400 text-sm">Verified household bundles from real relocating sellers.</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6 max-w-md">
          <input
            type="text"
            placeholder="Filter by city…"
            value={citySearch}
            onChange={e => setCitySearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">
            Search
          </button>
          {citySearch && (
            <button type="button" onClick={() => { setCitySearch(""); fetchCombos(undefined, activeType); }}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500">
              Clear
            </button>
          )}
        </form>

        {/* Bundle type pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {BUNDLE_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => handleTypeFilter(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeType === t.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-24 flex flex-col items-center">
            <div className="w-7 h-7 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-400">Loading setups…</p>
          </div>
        ) : displayedCombos.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No setups found</h2>
            <p className="text-gray-400 text-sm mb-6">
              Try a different city or filter, or{" "}
              <button onClick={() => { setActiveType(""); setCitySearch(""); fetchCombos(); }} className="text-indigo-600 hover:underline">
                view all listings
              </button>.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-medium mb-4">{displayedCombos.length} setup{displayedCombos.length !== 1 && "s"} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCombos.map(c => {
                const heroImg = c.items?.find(i => i.image)?.image;
                const discount = c.discountPercent;
                return (
                  <div
                    key={c._id}
                    onClick={() => navigate(`/combo/${c._id}`)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
                      {heroImg ? (
                        <img
                          src={heroImg} alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
                          <span className="text-5xl">
                            {c.bundleType?.includes("Full")    ? "🏠" :
                             c.bundleType?.includes("Kitchen") ? "🍳" :
                             c.bundleType?.includes("Bedroom") ? "🛏️" :
                             c.bundleType?.includes("Living")  ? "🛋️" : "📦"}
                          </span>
                          <span className="text-xs font-medium">{c.items?.length || 0} items</span>
                        </div>
                      )}

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        {c.bundleType && c.bundleType !== "Custom Bundle" && (
                          <span className="text-[10px] bg-white/90 text-indigo-700 font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {c.bundleType}
                          </span>
                        )}
                        {c.isWholeSetup && (
                          <span className="text-[10px] bg-amber-500 text-white font-bold px-2.5 py-1 rounded-full shadow-sm">
                            ⚡ Full Setup
                          </span>
                        )}
                      </div>
                      <span className="absolute top-3 right-3 text-[10px] bg-white text-green-600 font-bold px-2.5 py-1 rounded-full shadow-sm border border-green-100">
                        ✓ Verified
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{c.title}</h3>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 flex-wrap">
                        <span>📍 {c.city}</span>
                        <span>·</span>
                        <span>{c.items?.length || 0} item{c.items?.length !== 1 ? "s" : ""}</span>
                        {c.sellingModel && (
                          <>
                            <span>·</span>
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${MODEL_COLORS[c.sellingModel] || "bg-gray-100 text-gray-500"}`}>
                              {c.sellingModel}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {discount > 0 && (
                            <p className="text-[10px] text-gray-400 line-through">
                              ₹{Math.round(c.price / (1 - discount / 100)).toLocaleString()}
                            </p>
                          )}
                          <p className="text-xl font-extrabold text-indigo-600">₹{c.price?.toLocaleString()}</p>
                          {discount > 0 && (
                            <p className="text-[10px] text-green-600 font-bold">−{discount}% bundle discount</p>
                          )}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/combo/${c._id}`); }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}