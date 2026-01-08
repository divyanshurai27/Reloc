import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "Delhi",
    role: "seller",
  });
  const [msg, setMsg] = useState("");

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMsg("Signup successful!");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      // Only show error if success msg wasn't set
      setMsg(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white w-96 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Create Seller Account</h2>

        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handle}
        />
        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handle}
        />
        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handle}
        />
        <input
          className="border p-2 w-full mb-2 rounded-xl"
          placeholder="City"
          name="city"
          value={form.city}
          onChange={handle}
        />

        <button
          className="bg-black text-white w-full p-2 rounded-xl mt-2 font-semibold"
          onClick={submit}
        >
          Signup
        </button>

        {msg && (
          <p className={`text-center text-sm mt-3 ${msg.includes("successful") ? "text-green-400" : "text-red-500"}`}>
            {msg}
          </p>
        )}

        <p className="text-center text-xs mt-4">
          <Link to="/login" className="text-blue-600 underline">Login Instead</Link>
        </p>
      </div>
    </div>
  );
}
