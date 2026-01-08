import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import CreateCombo from "./pages/CreateCombo.jsx";
import ViewCombos from "./pages/ViewCombos.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-black">

      {/* NAVBAR */}
      <nav className="p-4 bg-gray-900 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/create-combo">Create Combo</Link>
        <Link to="/combos/Delhi">Delhi Marketplace</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/* PAGE ROUTES */}
      <Routes>
        <Route path="/" element={
          <div className="text-white p-10 text-center">
            <h1 className="text-4xl font-bold mb-3">Welcome to Reloc</h1>
            <p>Learn by doing MERN and win interviews 💪😎</p>
          </div>
        }/>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-combo" element={<CreateCombo />} />
        <Route path="/combos/:city" element={<ViewCombos />} />
        <Route path="/dashboard" element={<SellerDashboard />} />
      </Routes>

    </div>
  );
}
