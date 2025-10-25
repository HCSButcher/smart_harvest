// app/dashboard/foodbank/browse/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

type Item = {
  _id: string;
  name: string;
  quantity: number;
  location: string;
  farmerId: string;
  createdAt?: string;
};

export default function Browse() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Browse Produce</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name"
          className="border p-2 rounded"
        />
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Filter by location"
          className="border p-2 rounded"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-gray-600">No matching items</div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {filtered.map((it) => (
            <li key={it._id} className="bg-white p-4 rounded shadow">
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600">
                {it.quantity} kg — {it.location}
              </div>
              <div className="mt-3">
                <button className="px-3 py-1 bg-blue-600 text-white rounded">
                  Contact Farmer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
