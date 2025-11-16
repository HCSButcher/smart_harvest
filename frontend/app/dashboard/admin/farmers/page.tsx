"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    api.get("/admin/farmers").then((res) => setFarmers(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">👨‍🌾 Farmers</h1>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((f: any) => (
            <tr key={f._id} className="border-t">
              <td className="p-3">
                {f.firstName} {f.lastName}
              </td>
              <td>{f.email}</td>
              <td>{new Date(f.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
