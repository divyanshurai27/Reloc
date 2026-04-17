import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const STATUS_OPTIONS = [
  "Pending", "Pickup Scheduled", "Picked Up",
  "In Warehouse", "In Transit", "Delivered", "Installed", "Payment Completed",
];

const STATUS_COLORS = {
  "Pending":           "bg-yellow-100 text-yellow-700",
  "Pickup Scheduled":  "bg-blue-100 text-blue-700",
  "Picked Up":         "bg-purple-100 text-purple-700",
  "In Warehouse":      "bg-orange-100 text-orange-700",
  "In Transit":        "bg-indigo-100 text-indigo-700",
  "Delivered":         "bg-teal-100 text-teal-700",
  "Installed":         "bg-cyan-100 text-cyan-700",
  "Payment Completed": "bg-green-100 text-green-700",
  "Cancelled":         "bg-red-100 text-red-700",
};

const MODEL_COLORS = {
  "Direct Resale":       "bg-blue-100 text-blue-700",
  "Managed Consignment": "bg-purple-100 text-purple-700",
  "Instant Cashout":     "bg-amber-100 text-amber-700",
};

function StatCard({ label, value, sub, color = "text-gray-900", icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </div>
  );
}

export default function SellerDashboard() {
  const token    = localStorage.getItem("token");
  const role     = localStorage.getItem("role");
  const name     = localStorage.getItem("name") || "there";
  const navigate = useNavigate();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    if (role === "buyer") { navigate("/buyer-dashboard"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/seller",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch {
      console.log("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      alert("Status update failed.");
    } finally {
      setUpdating(null);
    }
  };

  /* stats */
  const activeOrders   = orders.filter(o => !["Payment Completed", "Cancelled"].includes(o.status));
  const completedCount = orders.filter(o => o.status === "Payment Completed").length;
  const totalEarnings  = orders.filter(o => o.status === "Payment Completed")
                               .reduce((sum, o) => sum + (o.comboId?.price || 0), 0);
  const bundleCount    = orders.filter(o => o.comboId?.isWholeSetup).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Hey, {name} 👋</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage listings, track orders, and get paid.</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/sell?mode=whole"
              id="btn-sell-everything"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-sm shadow-indigo-200"
            >
              ⚡ Sell Everything
            </Link>
            <Link
              to="/create-combo"
              id="btn-create-bundle"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
            >
              📦 Create Bundle
            </Link>
            <Link
              to="/sell"
              id="btn-add-item"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
            >
              + Add Item
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard label="Items / Bundles"  value={orders.length}                        sub="Total listings"         icon="📦"  />
          <StatCard label="Active Orders"    value={activeOrders.length}                  sub="In progress"            icon="🚐"  color="text-indigo-600" />
          <StatCard label="Completed"        value={completedCount}                       sub="Paid out"               icon="✅"  color="text-green-600" />
          <StatCard label="Earnings"         value={`₹${totalEarnings.toLocaleString()}`} sub="From completed orders"  icon="💰"  color="text-amber-600" />
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">All Orders</h2>
              <p className="text-xs text-gray-400 mt-0.5">{orders.length} total · {activeOrders.length} active</p>
            </div>
            <Link to="/combos" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
              View Marketplace →
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-16 flex flex-col items-center">
              <div className="w-7 h-7 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">Loading orders…</p>
            </div>
          )}

          {/* Empty */}
          {!loading && orders.length === 0 && (
            <div className="py-24 flex flex-col items-center text-center px-6">
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-sm text-gray-400 mb-8 max-w-xs">List your first item or bundle to start receiving orders.</p>
              <div className="flex gap-3">
                <Link to="/sell?mode=whole" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">
                  ⚡ Sell Everything
                </Link>
                <Link to="/sell" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                  + Add Item
                </Link>
              </div>
            </div>
          )}

          {/* Rows */}
          {!loading && orders.length > 0 && (
            <div className="divide-y divide-gray-50">
              {orders.map(order => (
                <div key={order._id} className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50/60 transition-colors">

                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900 truncate max-w-[240px]">
                        {order.comboId?.title || "Unnamed"}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                        {order.status}
                      </span>
                      {order.sellingModel && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${MODEL_COLORS[order.sellingModel] || "bg-gray-100 text-gray-500"}`}>
                          {order.sellingModel}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="font-semibold text-gray-600">₹{order.comboId?.price?.toLocaleString()}</span>
                      <span>·</span>
                      <span>{order.deliveryAddress}</span>
                      {order.pickupDate && (
                        <><span>·</span><span>Pickup {order.pickupDate}{order.pickupTime ? ` · ${order.pickupTime}` : ""}</span></>
                      )}
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <Link
                      to={`/tracking/${order._id}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap"
                    >
                      Track →
                    </Link>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
