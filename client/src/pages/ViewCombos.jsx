import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewCombos() {
  const { city } = useParams(); // may be undefined
  const navigate = useNavigate();

  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = city
      ? `http://localhost:5000/api/combos?city=${city}`
      : `http://localhost:5000/api/combos`;

    axios
      .get(url)
      .then((res) => setCombos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading combos...</p>;
  }

  return (
  
  <div className="bg-gray-100 min-h-screen py-10">
    <div className="max-w-7xl mx-auto px-6">

      <h2 className="text-3xl font-bold mb-8 text-center">
        {city ? `Combos in ${city}` : "All Available Combos"}
      </h2>

      {combos.length === 0 && (
        <p className="text-gray-500 text-center">
          No combos available.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            {/* IMAGE PLACEHOLDER */}
            <div className="h-40 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-400">
              Image
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">
                {c.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                {c.city}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  ₹{c.price}
                </span>

                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Verified
                </span>
              </div>

              <button
                onClick={() => navigate(`/combo/${c._id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);

}
