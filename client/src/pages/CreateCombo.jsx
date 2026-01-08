import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateCombo() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    comboName: "",
    price: "",
    description: "",
    city: "Delhi",
    category: "relocation",
  });
  const [msg, setMsg] = useState("");

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/combos/create",
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
        <h2 className="text-2xl font-bold text-center mb-4">Create Combo Pack</h2>

        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Combo Name"
          name="comboName"
          value={data.comboName}
          onChange={handle}
        />
        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Price"
          name="price"
          value={data.price}
          onChange={handle}
        />
        <textarea
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Description"
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

        <button
          className="bg-black text-white w-full p-2 rounded-xl mt-2 font-semibold"
          onClick={submit}
        >
          Create Combo
        </button>

        {msg && <p className="text-center text-sm text-red-500 mt-3">{msg}</p>}
      </div>
    </div>
  );
}
