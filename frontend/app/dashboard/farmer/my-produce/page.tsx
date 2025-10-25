// app/dashboard/farmer/my-produce/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useUser } from "@clerk/nextjs";

type Produce = {
  _id: string;
  farmerId: string;
  name: string;
  quantity: number;
  location: string;
  createdAt?: string;
};

export default function MyProduce() {
  const { user } = useUser();
  const [items, setItems] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/produce");
        const mine = (res.data as Produce[]).filter(
          (p) => p.farmerId === user?.id
        );
        setItems(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) run();
  }, [user?.id]);

  if (loading) return <div>Loading…</div>;
  if (items.length === 0)
    return (
      <div>
        No produce yet. Upload one{" "}
        <a className="text-green-700 underline" href="/dashboard/farmer/upload">
          here
        </a>
        .
      </div>
    );

  return (
    <ul className="grid md:grid-cols-2 gap-4">
      {items.map((it) => (
        <li key={it._id} className="bg-white p-4 rounded shadow">
          <div className="font-semibold">{it.name}</div>
          <div className="text-sm text-gray-600">
            {it.quantity} kg — {it.location}
          </div>
          {it.createdAt && (
            <div className="text-xs text-gray-500 mt-1">
              Added {new Date(it.createdAt).toLocaleString()}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
