"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function FoodbanksPage() {
  const [foodbanks, setFoodbanks] = useState([]);

  useEffect(() => {
    api.get("/admin/foodbanks").then((res) => setFoodbanks(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">🏦 Foodbanks</h1>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
          {foodbanks.map((fb: any) => (
            <tr key={fb._id} className="border-t">
              <td className="p-3">{fb.name}</td>
              <td>{fb.email}</td>
              <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
