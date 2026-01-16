import { Routes, Route, Link } from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import CreateCombo from "./pages/CreateCombo.jsx";
import ViewCombos from "./pages/ViewCombos.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import ComboDetails from "./pages/ComboDetails.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* NAVBAR */}
     <nav className="bg-white shadow sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

    {/* LOGO */}
    <Link to="/" className="text-2xl font-bold text-blue-600">
      Reloc
    </Link>

    {/* CENTER LINKS */}
    <div className="hidden md:flex gap-6 font-medium text-gray-700">
      <Link to="/combos" className="hover:text-blue-600">Buy</Link>
      <Link to="/create-combo" className="hover:text-blue-600">Sell</Link>
      <Link to="/dashboard" className="hover:text-blue-600">Seller</Link>
      <Link to="/buyer-dashboard" className="hover:text-blue-600">Buyer</Link>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex gap-4 items-center">
      <Link
        to="/login"
        className="text-gray-700 hover:text-blue-600 text-sm font-medium"
      >
        Login
      </Link>

      <Link
        to="/signup"
        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
      >
        Signup
      </Link>

      <Link
        to="/create-combo"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        Post Free Ad
      </Link>
    </div>

  </div>
</nav>

    

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/create-combo" element={<CreateCombo />} />

        <Route path="/combos" element={<ViewCombos />} />
        <Route path="/combos/:city" element={<ViewCombos />} />
        <Route path="/combo/:id" element={<ComboDetails />} />

        <Route path="/dashboard" element={<SellerDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      </Routes>

    </div>
  );
}
