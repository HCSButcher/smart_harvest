"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

type Item = {
  _id: string;
  name: string;
  quantity: number;
  unit?: string;
  location: string;
  farmerName?: string;
  farmerEmail?: string;
  contact?: string;
  farmerId: string;
  createdAt?: string;
};

export default function Browse() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/produce");
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const okName = q
          ? i.name.toLowerCase().includes(q.toLowerCase())
          : true;
        const okLoc = loc
          ? i.location.toLowerCase().includes(loc.toLowerCase())
          : true;
        return okName && okLoc;
      }),
    [items, q, loc]
  );

  if (loading) return <div>Loading produce…</div>;

  const openModal = (farmer: any) => setSelectedFarmer(farmer);
  const closeModal = () => setSelectedFarmer(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Browse Produce</h2>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name"
          className="border p-2 rounded w-full"
        />
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Filter by location"
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-gray-600">No matching items</div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {filtered.map((it) => (
            <li key={it._id} className="bg-white p-4 rounded shadow">
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {it.quantity} {it.unit || "kg"} — {it.location}
              </div>

              <button
                onClick={() => openModal(it)}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Contact Farmer
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedFarmer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedFarmer.farmerName || "Unknown Farmer"}
            </h2>

            <p>
              <strong>Email:</strong> {selectedFarmer.farmerEmail || "N/A"}
            </p>

            <p className="mt-1">
              <strong>Phone:</strong> {selectedFarmer.contact || "N/A"}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Location: {selectedFarmer.location}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
