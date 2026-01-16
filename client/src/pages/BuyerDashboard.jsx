import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500";
    case "Pickup Scheduled":
      return "bg-blue-500";
    case "In Inspection":
      return "bg-purple-500";
    case "Out for Delivery":
      return "bg-indigo-500";
    case "Delivered":
      return "bg-green-600";
    case "Cancelled":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
};

export default function BuyerDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
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
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">My Orders 📦</h1>
        <p className="text-gray-400 mb-8">
          Track your relocation combo orders and delivery status.
        </p>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="bg-gray-900 p-8 rounded-2xl text-center">
            <p className="text-lg mb-2">No orders yet</p>
            <p className="text-gray-400">
              Browse combos and place your first order.
            </p>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="grid gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-2xl p-5 shadow"
            >
              {/* TOP */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {order.comboId?.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    ₹{order.comboId?.price}
                  </p>
                </div>

                <span
                  className={`text-sm px-3 py-1 rounded-full text-white w-fit ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-4 text-sm text-gray-300 space-y-1">
                <p>
                  <span className="text-gray-400">Delivery Address:</span>{" "}
                  {order.deliveryAddress}
                </p>

                <p>
                  <span className="text-gray-400">Payment:</span>{" "}
                  <span
                    className={
                      order.paymentStatus === "Paid"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              {/* TIMELINE */}
              <div className="mt-4 border-t border-gray-700 pt-3">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
