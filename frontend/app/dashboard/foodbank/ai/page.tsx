// app/dashboard/foodbank/ai/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function FoodbankAI() {
  const [input, setInput] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    setInsight("");
    try {
      // Here we send a "produceList" but include the demand text as an object
      const res = await api.post("/ai/insights", {
        produceList: [{ demand: input }],
      });
      setInsight(res.data?.insight || "No insight");
    } catch (err) {
      console.error(err);
      setInsight("Failed to fetch insight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">AI Matching</h2>
      <form onSubmit={askAI}>
        <input
          type="textArea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your demand (e.g. need 200kg maize in Nakuru city by Friday)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Thinking…" : "Get Matches"}
        </button>
      </form>

      {insight && (
        <div className="mt-4 p-3 bg-gray-50 rounded border whitespace-pre-wrap">
          {insight}
        </div>
      )}
    </div>
  );
}
