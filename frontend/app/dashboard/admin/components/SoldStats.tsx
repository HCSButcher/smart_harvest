"use client";
import { useEffect, useState } from "react";
import { fetchSoldStats } from "@/lib/admin";

export default function SoldStats() {
  const [sold, setSold] = useState([]);

  useEffect(() => {
    fetchSoldStats().then((res) => setSold(res.sold));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded h-[300px] overflow-y-auto">
      <h2 className="font-bold text-lg mb-2">Sold Produce</h2>

      {sold.map((s: any) => (
        <div key={s._id} className="border-b py-2">
          <p className="font-semibold">{s.produceId?.name}</p>
          <p className="text-gray-600 text-sm">
            Buyer: {s.buyerId?.name} — {s.quantity} units
          </p>
        </div>
      ))}
    </div>
  );
}
