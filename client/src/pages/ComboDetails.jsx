import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ComboDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/combos/${id}`)
      .then((res) => setCombo(res.data))
      .catch(() => setMsg("Failed to load combo details"))
      .finally(() => setLoading(false));
  }, [id]);

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("Please login to place an order");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/orders/place",
        {
          comboId: combo._id,
          deliveryAddress: "Default address (edit later)",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.error || "Order failed");
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!combo) {
    return <p className="text-red-500 text-center mt-10">{msg}</p>;
  }

 return (
  <div className="bg-gray-100 min-h-screen py-10">
    <div className="max-w-5xl mx-auto px-6">

      {/* CARD */}
      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-8">

        {/* LEFT – IMAGE */}
        <div className="h-72 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
          Combo Image
        </div>

        {/* RIGHT – DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {combo.title}
          </h1>

          <p className="text-gray-500 mb-3">
            Location: {combo.city}
          </p>

          <p className="text-2xl font-semibold text-blue-600 mb-4">
            ₹{combo.price}
          </p>

          <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mb-6">
            Verified Seller
          </span>

          <h3 className="font-semibold mb-2">Items Included</h3>
          <ul className="list-disc ml-6 text-gray-700 mb-6">
            {combo.items.map((item, idx) => (
              <li key={idx}>
                {item.name} — <span className="text-gray-500">{item.condition}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={placeOrder}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Place Order
          </button>

          {msg && (
            <p className="text-sm text-center mt-3 text-red-500">
              {msg}
            </p>
          )}
        </div>
      </div>

      {/* SELLER INFO */}
      <div className="mt-6 bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-2">Seller Information</h3>
        <p className="text-sm text-gray-600">
          Name: {combo.seller?.name || "Verified Seller"}
        </p>
        <p className="text-sm text-gray-600">
          Contact available after order placement.
        </p>
      </div>

    </div>
  </div>
);

}
