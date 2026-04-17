import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage    from "./pages/LandingPage.jsx";
import Login          from "./pages/Login.jsx";
import Signup         from "./pages/Signup.jsx";
import SellFlow       from "./pages/SellFlow.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import TrackingPage   from "./pages/TrackingPage.jsx";
import CreateCombo    from "./pages/CreateCombo.jsx";
import ViewCombos     from "./pages/ViewCombos.jsx";
import ComboDetails   from "./pages/ComboDetails.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/signup"             element={<Signup />} />
        <Route path="/sell"               element={<SellFlow />} />
        <Route path="/dashboard"          element={<SellerDashboard />} />
        <Route path="/buyer-dashboard"    element={<BuyerDashboard />} />
        <Route path="/tracking/:orderId"  element={<TrackingPage />} />
        <Route path="/create-combo"       element={<CreateCombo />} />
        <Route path="/combos"             element={<ViewCombos />} />
        <Route path="/combos/:city"       element={<ViewCombos />} />
        <Route path="/combo/:id"          element={<ComboDetails />} />
      </Routes>
    </div>
  );
}