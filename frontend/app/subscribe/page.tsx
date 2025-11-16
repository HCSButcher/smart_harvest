"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import api from "@/lib/api";

export default function SubscribePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      alert("Please sign in to subscribe.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/payments/create-checkout", {
        email,
        amount: 1000, // KES 1000 subscription
        description: "Smart Harvest Premium Subscription",
      });

      const data = res.data;

      if (data.success && data.checkout_url) {
        // Redirect user to IntaSend checkout
        window.location.href = data.checkout_url;
      } else if (data.message) {
        // Show backend-provided error
        alert(data.message);
      } else {
        alert(
          "Failed to create payment session. Please contact support staff."
        );
      }
    } catch (err: any) {
      console.error(
        "IntaSend frontend error:",
        err.response?.data || err.message
      );

      // Show user-friendly message
      alert(
        err.response?.data?.message ||
          "Subscription service is currently unavailable. Please contact support staff."
      );
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
