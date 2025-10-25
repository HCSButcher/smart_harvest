"use client";

import { useUser } from "@clerk/nextjs";

export default function SubscriptionStatus() {
  const { user } = useUser();

  const isSubscribed = user?.publicMetadata?.subscribed === true;

  return (
    <div className="text-sm text-gray-700">
      {isSubscribed ? (
        <p className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
          ✅ Active Subscription
        </p>
      ) : (
        <p className="bg-red-100 text-red-800 px-4 py-2 rounded-md">
          ⚠️ No Active Subscription —{" "}
          <a href="/subscribe" className="underline">
            Subscribe Now
          </a>
        </p>
      )}
    </div>
  );
}
