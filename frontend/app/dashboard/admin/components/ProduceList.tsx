"use client";
import { useEffect, useState } from "react";
import { fetchAllProduce } from "@/lib/admin";

export default function ProduceList() {
  const [produce, setProduce] = useState([]);

  useEffect(() => {
    fetchAllProduce().then((res) => setProduce(res.produce));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded h-[300px] overflow-y-auto">
      <h2 className="font-bold text-lg mb-2">All Produce</h2>

      {produce.map((p: any) => (
        <div key={p._id} className="border-b py-2">
          <p className="font-semibold">{p.name}</p>
          <p className="text-sm text-gray-600">{p.quantity} units</p>
        </div>
      ))}
    </div>
  );
}
