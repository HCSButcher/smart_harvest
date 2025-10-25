"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function SubscribePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          amount: 1000, // e.g., KES 1000
          description: "Smart Harvest Premium Subscription",
        }),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = data.checkout_url;
      } else {
        alert("Failed to create payment session");
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        🌿 Subscribe to Smart Harvest AI
      </h1>
      <p className="text-gray-600 mb-6">
        Unlock AI crop insights and advanced analytics for just KES 1000/month.
      </p>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
      >
        {loading ? "Processing..." : "Subscribe Now"}
      </button>
    </div>
  );
}
