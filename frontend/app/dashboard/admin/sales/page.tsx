"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SalesOverview() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/admin/sales")
      .then((res) => {
        // Safely coerce the response to an array
        const data = res.data;
        if (Array.isArray(data)) {
          setSales(data);
        } else if (data && Array.isArray(data.sales)) {
          setSales(data.sales);
        } else if (data && typeof data === "object") {
          setSales([data]); // wrap single object in array
        } else {
          setSales([]); // fallback
        }
      })
      .catch((err) => {
        console.error("Failed to fetch sales:", err);
        setSales([]);
      });
  }, []);

  const total = sales.reduce((sum: number, s: any) => sum + (s.amount || 0), 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">💰 Sales Overview</h1>

      <p className="font-bold mb-4">Total: KES {total}</p>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Buyer</th>
            <th>Item</th>
            <th>Amount (KES)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s: any) => (
            <tr key={s._id} className="border-t">
              <td className="p-3">{s.buyerEmail}</td>
              <td>{s.itemName}</td>
              <td>{s.amount}</td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
