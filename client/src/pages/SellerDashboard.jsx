import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SellerDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // This ensures page doesn't break if router context was missing earlier
  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Welcome to Reloc, Seller 👋</h1>
        <p className="mb-6 text-lg opacity-80">
          Build, sell, and track relocation combo orders easily.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/create-combo"
            className="bg-white text-black p-3 rounded-2xl text-center font-semibold hover:opacity-90 transition"
          >
            Create Combo Pack
          </Link>

          <Link
            to="/combos/Delhi"
            className="bg-gray-200 text-black p-3 rounded-2xl text-center font-medium hover:opacity-90 transition"
          >
            View Delhi Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
