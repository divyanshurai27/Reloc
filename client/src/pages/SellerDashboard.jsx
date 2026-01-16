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
  
  <div className="bg-gray-100 min-h-screen py-10">
    <div className="max-w-7xl mx-auto px-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-1">Seller Dashboard</h1>
        <p className="text-gray-600">
          Manage your combo listings and track orders
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === "Pending").length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === "Delivered").length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{orders.reduce((sum, o) => sum + (o.comboId?.price || 0), 0)}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4 mb-10">
        <Link
          to="/create-combo"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          + Create New Combo
        </Link>

        <Link
          to="/combos"
          className="bg-white border px-5 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          View Marketplace
        </Link>
      </div>

      {/* ORDERS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Incoming Orders</h2>

        {orders.length === 0 && (
          <p className="text-gray-500">No orders yet.</p>
        )}

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">
                  {order.comboId?.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Buyer ID: {order.buyerId}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{order.comboId?.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg text-sm"
                >
                  <option>Pending</option>
                  <option>Pickup Scheduled</option>
                  <option>In Inspection</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);



  
}
