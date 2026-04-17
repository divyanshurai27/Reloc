import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const dashLink = role === "buyer" ? "/buyer-dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
            Reloc
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            to="/#how-it-works"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            How It Works
          </Link>
          <Link
            to="/combos"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Browse
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <Link
                to={dashLink}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 shadow-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-gray-700 mb-1 transition-all duration-200" style={{ transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
          <div className="w-5 h-0.5 bg-gray-700 mb-1 transition-all duration-200" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-gray-700 transition-all duration-200" style={{ transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 fade-in">
          <Link to="/#features" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link to="/#how-it-works" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/combos" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Browse</Link>
          {token ? (
            <>
              <Link to={dashLink} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="block text-sm font-medium text-red-500 py-2">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" className="block text-sm font-semibold text-indigo-600 py-2" onClick={() => setMenuOpen(false)}>Get started →</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
