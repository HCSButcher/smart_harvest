"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/admin/overview");
      setStats(data);
    };
    load();
  }, []);

  if (!stats) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">📊 Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Farmers" value={stats.farmers} />
        <Card title="Foodbanks" value={stats.foodbanks} />
        <Card title="Total Users" value={stats.users} />
        <Card title="Produce Items" value={stats.produceCount} />
        <Card title="Total Sales (KES)" value={stats.totalSales} />
        <Card title="AI Queries" value={stats.aiQueries} />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <p className="text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
