"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProduceInventory() {
  const [produce, setProduce] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/admin/produce")
      .then((res) => {
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          setProduce(res.data);
        } else if (res.data && Array.isArray(res.data.produce)) {
          setProduce(res.data.produce);
        } else {
          setProduce([]); // fallback if API returns unexpected shape
        }
      })
      .catch((err) => {
        console.error("Failed to fetch produce:", err);
        setProduce([]);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">🍅 Produce Inventory</h1>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Farmer</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {produce.map((p: any) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">{p.farmerEmail}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>KES {p.price}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
