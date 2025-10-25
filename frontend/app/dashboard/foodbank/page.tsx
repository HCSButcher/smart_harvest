"use client";

import SubscriptionStatus from "@/components/SubscriptionStatus";

export default function FoodbankDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">🏛️ Foodbank Dashboard</h1>
      <SubscriptionStatus />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">AI Food Demand Insights</h2>
          <p className="text-gray-600 text-sm">
            Analyze donation trends and forecast food needs with AI.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">Connect with Farmers</h2>
          <p className="text-gray-600 text-sm">
            Find nearby produce and distribution partners.
          </p>
        </div>
      </div>
    </div>
  );
}
