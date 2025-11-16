"use client";
import { useEffect, useState } from "react";
import { fetchUserStats } from "@/lib/admin";

export default function UserStats() {
  const [stats, setStats] = useState < any > null;

  useEffect(() => {
    fetchUserStats().then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white shadow rounded">
        <h2 className="font-bold">Farmers</h2>
        <p className="text-2xl">{stats.farmers}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h2 className="font-bold">Foodbanks</h2>
        <p className="text-2xl">{stats.foodbanks}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h2 className="font-bold">Admins</h2>
        <p className="text-2xl">{stats.admins}</p>
      </div>
    </div>
  );
}
