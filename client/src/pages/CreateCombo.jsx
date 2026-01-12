import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateCombo() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    price: "",
    description: "",
    city: "Delhi",
    items: [{ name: "", condition: "", image: "" }],
  });

  const [msg, setMsg] = useState("");

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...data.items];
    updatedItems[index][field] = value;
    setData({ ...data, items: updatedItems });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { name: "", condition: "", image: "" }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    setData({ ...data, items: updatedItems });
  };

  const submit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("Please login first!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/combos",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg("Combo created successfully!");
      setTimeout(() => navigate(`/combos/${data.city}`), 600);
    } catch (err) {
      setMsg(err.response?.data?.error || "Combo creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-white text-black w-96 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create Combo Pack
        </h2>

        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Combo Title"
          name="title"
          value={data.title}
          onChange={handle}
        />

        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Price"
          name="price"
          type="number"
          value={data.price}
          onChange={handle}
        />

        <textarea
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Description (optional)"
          name="description"
          value={data.description}
          onChange={handle}
        />

        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="City"
          name="city"
          value={data.city}
          onChange={handle}
        />

        <h4 className="font-semibold mt-3 mb-2">Items in Combo</h4>

        {data.items.map((item, index) => (
          <div
            key={index}
            className="border p-2 mb-2 rounded-xl"
          >
            <input
              className="border p-1 w-full mb-1 rounded"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                handleItemChange(index, "name", e.target.value)
              }
            />
            <input
              className="border p-1 w-full mb-1 rounded"
              placeholder="Condition"
              value={item.condition}
              onChange={(e) =>
                handleItemChange(index, "condition", e.target.value)
              }
            />
            <input
              className="border p-1 w-full rounded"
              placeholder="Image URL (optional)"
              value={item.image}
              onChange={(e) =>
                handleItemChange(index, "image", e.target.value)
              }
            />

            {data.items.length > 1 && (
              <button
                className="text-red-500 text-sm mt-1"
                onClick={() => removeItem(index)}
              >
                Remove item
              </button>
            )}
          </div>
        ))}

        <button
          className="text-sm text-blue-600 mb-3"
          onClick={addItem}
        >
          + Add another item
        </button>

        <button
          className="bg-black text-white w-full p-2 rounded-xl font-semibold"
          onClick={submit}
        >
          Create Combo
        </button>

        {msg && (
          <p className="text-center text-sm text-red-500 mt-3">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
