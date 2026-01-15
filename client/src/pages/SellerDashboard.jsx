import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = [
  "Pending",
  "Pickup Scheduled",
  "In Inspection",
  "Out for Delivery",
  "Delivered",
];

export default function SellerDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Protect route
  useEffect(() => {
    if (!token) navigate("/login");
    else fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/seller",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch {
      console.log("Failed to fetch seller orders");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      alert("Failed to update order status");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 max-w-4xl mx-auto">

        {/* SELLER WELCOME */}
        <h1 className="text-4xl font-bold mb-2">
          Welcome to Reloc, Seller 👋
        </h1>
        <p className="mb-6 text-lg opacity-80">
          Build, sell, and track relocation combo orders easily.
        </p>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link
            to="/create-combo"
            className="bg-white text-black p-3 rounded-2xl text-center font-semibold"
          >
            Create Combo Pack
          </Link>

          <Link
            to="/combos"
            className="bg-gray-200 text-black p-3 rounded-2xl text-center font-medium"
          >
            View All Marketplace Combos
          </Link>
        </div>

        {/* SELLER ORDERS */}
        <h2 className="text-2xl font-semibold mb-4">
          Incoming Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">
            No orders received yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-white text-black p-4 rounded-2xl shadow"
              >
                <h3 className="font-semibold mb-1">
                  {o.comboId?.title}
                </h3>

                <p className="text-sm">
                  Buyer ID: {o.buyerId}
                </p>

                <p className="text-sm mb-2">
                  Current Status: <b>{o.status}</b>
                </p>

                <select
                  className="border p-2 rounded w-full"
                  value={o.status}
                  onChange={(e) =>
                    updateStatus(o._id, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
