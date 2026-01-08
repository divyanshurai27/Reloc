import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // use only one navigate

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      
      // Save token properly
      localStorage.setItem("token", res.data.token);
      
      setMsg("Login successful!");
      
      // Navigate to dashboard or combo creation
      navigate("/dashboard"); // better flow than direct create-combo
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white w-96 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

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

        <button
          className="bg-black text-white w-full p-2 rounded-xl mt-2 font-semibold"
          onClick={submit}
        >
          Login
        </button>

        {msg && <p className="text-center text-sm text-red-500 mt-3">{msg}</p>}

        <p className="text-center text-xs mt-4">
          <Link to="/signup" className="text-blue-600 underline">
            Create Seller Account
          </Link>
        </p>
      </div>
    </div>
  );
}
