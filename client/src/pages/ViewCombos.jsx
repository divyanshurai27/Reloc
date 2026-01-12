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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        {city ? `Combos in ${city}` : "All Available Combos"}
      </h2>

      {combos.length === 0 && (
        <p className="text-gray-400 text-center">
          No combos available.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {combos.map((c) => (
          <div
            key={c._id}
            className="bg-white p-4 rounded-2xl shadow-md"
          >
            <h3 className="text-lg font-semibold mb-1">
              {c.title}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              City: {c.city}
            </p>

            <p className="font-bold mb-3">
              ₹ {c.price}
            </p>

            <button
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => navigate(`/combo/${c._id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
