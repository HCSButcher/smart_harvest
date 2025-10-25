"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubscriptionStatus from "@/components/SubscriptionStatus";

export default function FarmerDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!user) return;

      // If user already subscribed, skip verification
      if (user.publicMetadata?.subscribed === true) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch("/api/payments/verify-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });

        const data = await res.json();

        if (data.subscribed) {
          // Optionally trigger Clerk metadata refresh
          window.location.reload();
        } else {
          console.log("User not subscribed yet.");
        }
      } catch (err) {
        console.error("Verification failed:", err);
      } finally {
        setChecking(false);
      }
    };

    verifyPayment();
  }, [user]);

  if (checking)
    return <p className="text-center p-6">Checking subscription...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">🌾 Farmer Dashboard</h1>
      <SubscriptionStatus />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">Upload Produce</h2>
          <p className="text-gray-600 text-sm">
            Add your harvested produce to the platform.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="font-bold text-lg mb-2">AI Crop Insights</h2>
          <p className="text-gray-600 text-sm">
            Use AI to analyze soil and crop health.
          </p>
        </div>
      </div>
    </div>
  );
}
