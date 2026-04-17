import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", city: "", role: "seller",
  });
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      const { user } = res.data;
      /* After signup, auto-login */
      const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email, password: form.password
      });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("role",  loginRes.data.user.role);
      localStorage.setItem("name",  loginRes.data.user.name);
      navigate(form.role === "buyer" ? "/buyer-dashboard" : "/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.error || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-sm slide-up">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Start selling in minutes</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={submit} className="space-y-4">

              {/* Role toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                {["seller", "buyer"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                      form.role === r
                        ? "bg-white shadow-sm text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {r === "seller" ? "👤 I'm selling" : "🛍 I'm buying"}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">City <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  id="signup-city"
                  name="city"
                  type="text"
                  placeholder="e.g. Delhi"
                  value={form.city}
                  onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>

              {msg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
                  {msg}
                </div>
              )}

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account…</>
                ) : "Create Account →"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            By creating an account, you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}