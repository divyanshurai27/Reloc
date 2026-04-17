import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const STATUS_COLORS = {
  "Pending":           "bg-yellow-100 text-yellow-700",
  "Pickup Scheduled":  "bg-blue-100 text-blue-700",
  "Picked Up":         "bg-purple-100 text-purple-700",
  "In Transit":        "bg-indigo-100 text-indigo-700",
  "Delivered":         "bg-teal-100 text-teal-700",
  "Payment Completed": "bg-green-100 text-green-700",
  "Cancelled":         "bg-red-100 text-red-700",
};

export default function BuyerDashboard() {
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!token) { navigate("/login"); return; }
    if (role !== "buyer") { navigate("/dashboard"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/buyer",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch {
      console.log("Failed to fetch buyer orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1 text-sm">Track all your purchases and deliveries in one place.</p>
          </div>
          <Link
            to="/combos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
          >
            Browse Combos →
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center">
            <div className="w-7 h-7 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-400">Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center">
            <p className="text-5xl mb-4">📭</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-xs">Browse the marketplace and place your first order from a seller near you.</p>
            <Link
              to="/combos"
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              Browse Combos →
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                    📦
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-900">{order.comboId?.title || "Item Bundle"}</h2>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                      <span>₹{order.comboId?.price?.toLocaleString()}</span>
                      <span>·</span>
                      <span>{order.deliveryAddress}</span>
                      {order.pickupDate && (
                        <>
                          <span>·</span>
                          <span>Pickup: {order.pickupDate}{order.pickupTime ? ` · ${order.pickupTime}` : ""}</span>
                        </>
                      )}
                    </div>

                    {/* Mini timeline */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {["Pending", "Pickup Scheduled", "Picked Up", "In Transit", "Delivered", "Payment Completed"].map((s, i, arr) => {
                        const statusIdx = arr.indexOf(order.status);
                        const done = i <= statusIdx;
                        return (
                          <React.Fragment key={s}>
                            <div className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${done ? "bg-indigo-500" : "bg-gray-200"}`} />
                            {i < arr.length - 1 && (
                              <div className={`flex-1 h-0.5 min-w-[8px] ${i < statusIdx ? "bg-indigo-500" : "bg-gray-200"}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                    <Link
                      to={`/tracking/${order._id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition"
                    >
                      Track Order →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}