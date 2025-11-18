"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import api from "@/lib/api";

type Purchase = {
  _id: string;
  items: {
    name: string;
    quantity: number;
    unit?: string;
    price: number;
    farmerName: string;
  }[];
  totalAmount: number;
  createdAt: string;
};

export default function PreviousPurchases() {
  const { user } = useUser();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      try {
        const res = await api.get(`/purchase/user/${user.id}`);
        setPurchases(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (loading) return <div>Loading purchases…</div>;

  if (!purchases.length)
    return <div className="text-gray-600">No previous purchases found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">🧾 Previous Purchases</h1>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div
            key={purchase._id}
            className="border rounded p-4 bg-white shadow"
          >
            <p className="text-sm text-gray-500">
              Purchased on: {new Date(purchase.createdAt).toLocaleString()}
            </p>

            <ul className="mt-2">
              {purchase.items.map((item, idx) => (
                <li key={idx} className="flex justify-between border-b py-1">
                  <span>
                    {item.name} ({item.quantity} {item.unit || "kg"}) — Farmer:{" "}
                    {item.farmerName}
                  </span>
                  <span>KES {item.price}</span>
                </li>
              ))}
            </ul>

            <p className="mt-2 font-semibold">
              Total: KES {purchase.totalAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
