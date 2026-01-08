import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ViewCombos() {
  const { city } = useParams();
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/combos/city/${city}`)
      .then(res => setCombos(res.data))
      .catch(() => {});
  }, [city]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Combo Packs in {city}</h2>
      <div className="grid gap-4">
        {combos.map(c => (
          <div key={c._id} className="bg-white p-4 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold">{c.comboName}</h3>
            <p className="text-sm">{c.description}</p>
            <p className="text-sm font-medium mt-2">₹{c.price}</p>
            <p className="text-xs text-gray-500">Seller: {c.sellerId?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
