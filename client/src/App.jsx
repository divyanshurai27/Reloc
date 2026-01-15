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
    <div className="min-h-screen bg-black text-white">

     
      <nav className="p-4 bg-gray-900 flex gap-4 justify-center text-sm md:text-base">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/signup" className="hover:text-gray-300">Signup</Link>
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/create-combo" className="hover:text-gray-300">Create Combo</Link>
        <Link to="/combos" className="hover:text-gray-300">All Combos</Link>
        <Link to="/dashboard" className="hover:text-gray-300">Seller Dashboard</Link>
        <Link to="/buyer-dashboard" className="hover:text-gray-300">Buyer Dashboard</Link>
      </nav>

      
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
