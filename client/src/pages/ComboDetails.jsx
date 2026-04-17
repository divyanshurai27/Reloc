import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function ComboDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [combo,   setCombo]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/combos/${id}`)
      .then(res => setCombo(res.data))
      .catch(() => setMsg("Failed to load combo details"))
      .finally(() => setLoading(false));
  }, [id]);

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    if (!address.trim()) { setMsg("Please enter a delivery address."); return; }
    setPlacing(true); setMsg("");
    try {
      await axios.post(
        "http://localhost:5000/api/orders/place",
        { comboId: combo._id, deliveryAddress: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate("/buyer-dashboard"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Order failed. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-xl font-bold text-gray-900 mb-2">Combo not found</p>
          <p className="text-sm text-gray-400 mb-6">{msg}</p>
          <Link to="/combos" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
            Back to Combos
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = combo.items?.find(i => i.image)?.image;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 fade-in">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/combos" className="hover:text-gray-600 transition">Combos</Link>
          <span>/</span>
          <span className="text-gray-600">{combo.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left: Image */}
          <div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl h-80 flex items-center justify-center overflow-hidden">
              {heroImage ? (
                <img src={heroImage} alt={combo.title} className="w-full h-full object-cover rounded-3xl" />
              ) : (
                <div className="flex flex-col items-center text-gray-300">
                  <span className="text-6xl">📦</span>
                  <span className="text-sm mt-2 font-medium">{combo.items?.length} items</span>
                </div>
              )}
            </div>

            {/* Items grid */}
            {combo.items?.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Items Included</h3>
                <div className="space-y-2">
                  {combo.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📦</div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        {item.condition && (
                          <p className="text-xs text-gray-400">Condition: {item.condition}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Details & order */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full border border-green-100">
                ✓ Verified Seller
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full border border-indigo-100">
                📍 {combo.city}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{combo.title}</h1>

            {combo.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{combo.description}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold text-indigo-600">₹{combo.price?.toLocaleString()}</span>
              <span className="text-sm text-gray-400">/ total bundle</span>
            </div>

            {/* Seller info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                {(combo.seller?.name || "S")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{combo.seller?.name || "Verified Seller"}</p>
                <p className="text-xs text-gray-400">Verified member · Contact after order</p>
              </div>
            </div>

            {/* Order form */}
            {success ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-bold text-green-700 text-lg">Order Placed!</p>
                <p className="text-sm text-green-500 mt-1">Redirecting to your dashboard…</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Delivery Address</label>
                  <input
                    type="text"
                    placeholder="Enter your full delivery address"
                    value={address}
                    onChange={e => { setAddress(e.target.value); setMsg(""); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </div>

                {msg && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
                    {msg}
                  </div>
                )}

                <button
                  id="btn-place-order"
                  onClick={placeOrder}
                  disabled={placing}
                  className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {placing ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing Order…</>
                  ) : "Place Order →"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Payment collected only after inspection &amp; confirmation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}