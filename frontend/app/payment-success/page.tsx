"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PaymentSuccess() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-700 mb-8">
          Thank you for subscribing to Smart Harvest. You now have full access.
        </p>
        <Link
          href="/dashboard/farmer"
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
