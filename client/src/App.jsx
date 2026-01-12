import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import CreateCombo from "./pages/CreateCombo.jsx";
import ViewCombos from "./pages/ViewCombos.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import ComboDetails from "./pages/ComboDetails.jsx";


export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="p-4 bg-gray-900 flex gap-4 justify-center text-sm md:text-base">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/signup" className="hover:text-gray-300">Signup</Link>
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/create-combo" className="hover:text-gray-300">Create Combo</Link>
        <Link to="/combos" className="hover:text-gray-300">All Combos</Link>
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
      </nav>

      {/* PAGE ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-10 text-center">
              <h1 className="text-4xl font-bold mb-3">Welcome to Reloc</h1>
              <p className="text-gray-300">
                Learn by building real MERN projects 🚀
              </p>
            </div>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-combo" element={<CreateCombo />} />
        <Route path="/combos/:city" element={<ViewCombos />} />
        <Route path="/dashboard" element={<SellerDashboard />} />
        <Route path="/combo/:id" element={<div className="text-white p-10">Combo Details Page</div>} />
        <Route path="/combo/:id" element={<ComboDetails />} />
        <Route path="/combos" element={<ViewCombos />} />
<Route path="/combos/:city" element={<ViewCombos />} />



      </Routes>

    </div>
  );
}
