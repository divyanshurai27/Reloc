import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-gray-100">

      {/* HERO */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              Sell Faster When You Relocate
            </h1>
            <p className="text-gray-600 mb-6">
              Buy and sell verified household combo packs when moving cities.
            </p>

            <div className="flex gap-4">
              <Link
                to="/combos"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Browse Combos
              </Link>

              <Link
                to="/create-combo"
                className="border px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
              >
                Sell a Combo
              </Link>
            </div>
          </div>

          <div className="h-72 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            Marketplace Preview
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Combo Selling</h3>
            <p className="text-gray-600">
              Sell multiple items together instead of listing one by one.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-2">1-Click Exit</h3>
            <p className="text-gray-600">
              Moving cities? List everything once and exit quickly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-2">End-to-End Flow</h3>
            <p className="text-gray-600">
              From order to delivery tracking — all in one place.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
