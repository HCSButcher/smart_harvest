"use client";

import SubscriptionStatus from "@/components/SubscriptionStatus";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">👨‍💼 Admin Dashboard</h1>
      <SubscriptionStatus />
      <div className="mt-6">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">System Overview</h2>
          <p className="text-gray-600 text-sm">
            Manage users, track payments, and oversee Smart Harvest operations.
          </p>
        </div>
      </div>
    </div>
  );
}
