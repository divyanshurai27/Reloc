import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold mb-4">
          Reloc
        </h1>

        <p className="text-xl max-w-2xl mb-6 opacity-80">
          Sell your household items fast when moving cities.
          Buy verified relocation combo packs with ease.
        </p>

        <div className="flex gap-4">
          <Link
            to="/combos"
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:opacity-90"
          >
            Browse Combos
          </Link>

          <Link
            to="/create-combo"
            className="border border-white px-6 py-3 rounded-2xl font-semibold hover:bg-white hover:text-black transition"
          >
            Sell a Combo
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Reloc?
        </h2>

        <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-3">
          <div className="bg-black p-6 rounded-2xl text-center">
            <h3 className="text-xl font-semibold mb-2">Combo Selling</h3>
            <p className="text-sm opacity-80">
              Sell multiple household items together instead of listing one by one.
            </p>
          </div>

          <div className="bg-black p-6 rounded-2xl text-center">
            <h3 className="text-xl font-semibold mb-2">1-Click Exit</h3>
            <p className="text-sm opacity-80">
              Moving cities? List everything once and exit quickly.
            </p>
          </div>

          <div className="bg-black p-6 rounded-2xl text-center">
            <h3 className="text-xl font-semibold mb-2">End-to-End Flow</h3>
            <p className="text-sm opacity-80">
              From order to delivery tracking — everything in one place.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid gap-8 max-w-4xl mx-auto md:grid-cols-3 text-center">
          <div>
            <h3 className="font-semibold mb-2">1. Seller Lists Combo</h3>
            <p className="text-sm opacity-80">
              Add items, price, and city.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Buyer Places Order</h3>
            <p className="text-sm opacity-80">
              Browse combos and place order instantly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Track & Receive</h3>
            <p className="text-sm opacity-80">
              Track order status until delivery.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Relocate Smarter?
        </h2>
        <p className="mb-6 opacity-80">
          Join Reloc and simplify your city move.
        </p>

        <Link
          to="/signup"
          className="bg-white text-black px-8 py-3 rounded-2xl font-semibold hover:opacity-90"
        >
          Get Started
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm opacity-60">
        © {new Date().getFullYear()} Reloc · Built with MERN
      </footer>
    </div>
  );
}
