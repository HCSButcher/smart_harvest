"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function AIInsights() {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribed = user?.publicMetadata?.subscribed;

  const askAI = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResponse(data.insight);
    setLoading(false);
  };

  if (!subscribed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">🚫 AI Insights Locked</h2>
        <p className="mb-4">Subscribe to access SmartHarvest AI Insights.</p>
        <a
          href="/dashboard/farmer"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🤖 SmartHarvest AI Insights</h1>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask SmartHarvest AI..."
        className="w-full border rounded p-3 mb-4"
      />
      <button
        onClick={askAI}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">AI Insight:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
