"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data));
  }, []);

  if (!analytics) return <p className="p-8">Loading analytics...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">📈 Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Monthly Users"
          value={analytics.monthlyUsers?.count ?? 0}
        />
        <StatCard
          title="Monthly Produce Uploads"
          value={analytics.monthlyUploads?.count ?? 0}
        />
        <StatCard
          title="Monthly Sales"
          value={`KES ${analytics.monthlySales ?? 0}`}
        />
        <StatCard title="AI Queries" value={analytics.aiQueries ?? 0} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <p className="text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
