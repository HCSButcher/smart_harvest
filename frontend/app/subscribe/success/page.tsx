"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SubscriptionSuccess() {
  const { user } = useUser();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    const verifyPayment = async () => {
      if (!user) return;

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
          setStatusMessage(
            "✅ Payment verified! Redirecting to your dashboard..."
          );
          setTimeout(() => {
            // Redirect user based on role
            const role = user.publicMetadata?.role || "farmer";
            router.push(`/dashboard/${role}`);
          }, 3000);
        } else {
          setStatusMessage(
            "⚠️ We couldn’t verify your payment. Please contact support."
          );
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatusMessage(
          "❌ Error verifying payment. Please refresh or try again."
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center p-8">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md success-card">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-6">{statusMessage}</p>

        {verifying ? (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto" />
        ) : (
          <button
            onClick={() => {
              const role = user?.publicMetadata?.role || "farmer";
              router.push(`/dashboard/${role}`);
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
