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
    <div className="p-6 max-w-3xl mx-auto text-white">
      <div className="bg-white text-black rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">{combo.title}</h2>

        <p className="text-sm text-gray-600 mb-3">
          City: {combo.city}
        </p>

        <p className="text-lg font-semibold mb-4">
          ₹ {combo.price}
        </p>

        <h4 className="font-semibold mb-2">Items in this combo</h4>

        <ul className="list-disc list-inside mb-4">
          {combo.items.map((item, index) => (
            <li key={index}>
              <span className="font-medium">{item.name}</span>
              {" — "}
              <span className="text-sm text-gray-600">
                {item.condition}
              </span>
            </li>
          ))}
        </ul>

        <button
          className="bg-black text-white px-6 py-2 rounded-xl font-semibold"
          onClick={placeOrder}
        >
          Place Order
        </button>

        {msg && (
          <p className="text-sm text-red-500 mt-3">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
