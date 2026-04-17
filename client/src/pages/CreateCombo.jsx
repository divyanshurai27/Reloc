import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const CITIES = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Other"];

export default function CreateCombo() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "", price: "", description: "", city: "Delhi",
    items: [{ name: "", condition: "Good", image: "" }],
  });
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleItem = (idx, field, value) => {
    const items = [...data.items];
    items[idx][field] = value;
    setData({ ...data, items });
  };

  const addItem    = () => setData({ ...data, items: [...data.items, { name: "", condition: "Good", image: "" }] });
  const removeItem = (idx) => setData({ ...data, items: data.items.filter((_, i) => i !== idx) });

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    setLoading(true); setMsg("");
    try {
      await axios.post(
        "http://localhost:5000/api/combos",
        { ...data, price: Number(data.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to create combo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a Combo</h1>
          <p className="text-gray-500 mt-1 text-sm">Bundle multiple items together for a faster sale.</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Combo Title *</label>
            <input
              name="title" required placeholder="e.g. Full Bedroom Setup"
              value={data.title} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Price + City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Price (₹) *</label>
              <input
                name="price" type="number" required placeholder="e.g. 8000"
                value={data.price} onChange={handle}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
              <select
                name="city" value={data.city} onChange={handle}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              name="description" rows={3} placeholder="What's in this combo? Any special notes..."
              value={data.description} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Items in Combo</label>
              <button type="button" onClick={addItem} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition">
                + Add item
              </button>
            </div>
            <div className="space-y-3">
              {data.items.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      placeholder="Item name"
                      value={item.name}
                      onChange={e => handleItem(idx, "name", e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <select
                      value={item.condition}
                      onChange={e => handleItem(idx, "condition", e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {["New", "Good", "Used", "For Parts"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <input
                    placeholder="Image URL (optional)"
                    value={item.image}
                    onChange={e => handleItem(idx, "image", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  {data.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-600 mt-2 transition">
                      − Remove item
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {msg && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">{msg}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</>
            ) : "Create Combo →"}
          </button>
        </form>
      </div>
    </div>
  );
}