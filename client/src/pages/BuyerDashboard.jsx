import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BuyerDashboard() {
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
      <div className="p-6 max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">
          My Orders 🛒
        </h1>
        <p className="mb-6 text-lg opacity-80">
          Track your relocation combo orders in real time.
        </p>

        {/* ORDERS */}
        {orders.length === 0 ? (
          <p className="text-gray-400">
            You haven’t placed any orders yet.
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

                <p className="text-sm mb-1">
                  Price: ₹{o.comboId?.price}
                </p>

                <p className="text-sm mb-1">
                  Order Status: <b>{o.status}</b>
                </p>

                <p className="text-sm mb-1">
                  Payment: <b>{o.paymentStatus}</b>
                </p>

                <p className="text-xs text-gray-600 mt-2">
                  Delivery Address: {o.deliveryAddress}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
