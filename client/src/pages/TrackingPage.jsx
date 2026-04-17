import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const STEPS = [
  {
    key:  "Pickup Scheduled",
    label: "Pickup Scheduled",
    icon:  "📅",
    desc:  "Pickup confirmed. Our team will arrive on the scheduled date.",
  },
  {
    key:  "Picked Up",
    label: "Picked Up",
    icon:  "🚐",
    desc:  "Items collected from your location. Heading to our facility.",
  },
  {
    key:  "In Warehouse",
    label: "In Warehouse",
    icon:  "🏭",
    desc:  "Items are at our warehouse — being inspected and verified.",
    optional: true,
  },
  {
    key:  "In Transit",
    label: "In Transit",
    icon:  "📦",
    desc:  "Packed and on the way to the buyer's address.",
  },
  {
    key:  "Delivered",
    label: "Delivered",
    icon:  "✅",
    desc:  "Successfully delivered to the buyer.",
  },
  {
    key:  "Installed",
    label: "Installed",
    icon:  "🔧",
    desc:  "Items have been set up and installed at the buyer's location.",
    optional: true,
  },
  {
    key:  "Payment Completed",
    label: "Payment Released",
    icon:  "💸",
    desc:  "Payment has been released to the seller's account.",
  },
];

const STATUS_INDEX = {
  "Pending":           -1,
  "Pickup Scheduled":   0,
  "Picked Up":          1,
  "In Warehouse":       2,
  "In Transit":         3,
  "Delivered":          4,
  "Installed":          5,
  "Payment Completed":  6,
  "Cancelled":          -2,
};

const MODEL_COLORS = {
  "Direct Resale":       "bg-blue-100 text-blue-700",
  "Managed Consignment": "bg-purple-100 text-purple-700",
  "Instant Cashout":     "bg-amber-100 text-amber-700",
};

export default function TrackingPage() {
  const { orderId } = useParams();
  const token = localStorage.getItem("token");
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!token || !orderId) { setLoading(false); return; }
    const tryFetch = async () => {
      try {
        const role = localStorage.getItem("role");
        const endpoint = role === "seller" ? "seller" : "buyer";
        const res = await axios.get(
          `http://localhost:5000/api/orders/${endpoint}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const found = res.data.find(o => o._id === orderId);
        found ? setOrder(found) : setError("Order not found.");
      } catch {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };
    tryFetch();
  }, [orderId]);

  const currentIdx  = order ? (STATUS_INDEX[order.status] ?? -1) : -1;
  const isCancelled = order?.status === "Cancelled";
  const isPending   = order?.status === "Pending";
  const progress    = currentIdx < 0 ? 0 : Math.round(((currentIdx + 1) / STEPS.length) * 100);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading order…</p>
        </div>
      </div>
    );
  }

  /* ── Error / not found ── */
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error || "We couldn't find this order."}</p>
          <Link to="/dashboard" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12 fade-in">

        {/* Breadcrumb */}
        <Link to="/dashboard" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6 transition">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Order Tracking</h1>
          <p className="text-sm text-gray-400 mt-0.5">#{orderId.slice(-8).toUpperCase()}</p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 truncate">{order.comboId?.title || "Item Bundle"}</h2>
              <p className="text-sm text-gray-400 truncate mt-0.5">{order.deliveryAddress}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-base font-extrabold text-indigo-600">₹{order.comboId?.price?.toLocaleString()}</span>
                {order.sellingModel && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${MODEL_COLORS[order.sellingModel] || "bg-gray-100 text-gray-600"}`}>
                    {order.sellingModel}
                  </span>
                )}
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {order.pickupDate && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
              <span>📅</span>
              <span>Pickup: <strong className="text-gray-800">{order.pickupDate}</strong>{order.pickupTime ? ` · ${order.pickupTime}` : ""}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {!isCancelled && !isPending && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 pt-5 pb-4 mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span className="font-semibold">Overall Progress</span>
              <span className="font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cancelled */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
            <p className="text-4xl mb-3">❌</p>
            <p className="font-bold text-red-700 text-lg">Order Cancelled</p>
            <p className="text-sm text-red-400 mt-1">Contact support if you need assistance.</p>
          </div>
        ) : isPending ? (
          <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8 text-center">
            <p className="text-4xl mb-3">⏳</p>
            <p className="font-bold text-yellow-700 text-lg">Awaiting Confirmation</p>
            <p className="text-sm text-yellow-500 mt-1">Your listing is live. Pickup will be scheduled once confirmed.</p>
          </div>
        ) : (
          /* ── Timeline ── */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
            <h3 className="font-extrabold text-gray-900 mb-8 flex items-center gap-2">
              <span>🚦</span> Delivery Journey
            </h3>

            <div className="relative">
              {STEPS.map((step, i) => {
                const done    = i < currentIdx + 1;
                const active  = i === currentIdx + (order.status === "Pending" ? 0 : 0);
                const isCurr  = step.key === order.status;
                const pending = !done && !isCurr;

                return (
                  <div key={step.key} className="flex gap-5 pb-8 last:pb-0 relative">
                    {/* Vertical line */}
                    {i < STEPS.length - 1 && (
                      <div
                        className="absolute left-5 top-10 bottom-0 w-0.5 z-0"
                        style={{ background: done ? "#6366f1" : "#e5e7eb" }}
                      />
                    )}

                    {/* Node */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 transition-all duration-500 ${
                      done    ? "bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200"
                      : isCurr ? "bg-indigo-600 border-indigo-600 ring-4 ring-indigo-100 pulse-ring shadow-lg"
                      : "bg-white border-gray-200"
                    }`}>
                      {done ? (
                        <span className="text-white text-sm font-extrabold">✓</span>
                      ) : (
                        <span className={pending ? "grayscale opacity-30" : ""}>{step.icon}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-1.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-bold text-sm ${done || isCurr ? "text-gray-900" : "text-gray-300"}`}>
                          {step.label}
                        </p>
                        {step.optional && (
                          <span className="text-[10px] text-gray-300 font-medium border border-gray-200 px-1.5 py-0.5 rounded-full">optional</span>
                        )}
                        {isCurr && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                      {(done || isCurr) && (
                        <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inspection note */}
        {order.inspectionNote && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700">
            <strong>📋 Inspection Note:</strong> {order.inspectionNote}
          </div>
        )}

      </div>
    </div>
  );
}
