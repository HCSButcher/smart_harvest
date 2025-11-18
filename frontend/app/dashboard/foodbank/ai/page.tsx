"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import api from "@/lib/api";

export default function FoodbankAI() {
  const [input, setInput] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const askAI = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setInsight("");

    try {
      if (!user) {
        setInsight("User not authenticated.");
        return;
      }

      if (!input.trim()) {
        setInsight("Please describe your demand first.");
        return;
      }

      // 🚀 Send to Groq-powered backend
      const res = await api.post("/ai/insights", {
        question: input,
        userId: user.id,
      });

      const answer = res.data?.insight?.answer;

      setInsight(answer || "No insight returned from the AI.");
    } catch (err: any) {
      console.error("AI request error:", err);

      if (err.response?.status === 429) {
        setInsight(
          "⚠️ AI quota reached. Please contact support staff to continue using this service."
        );
      } else {
        setInsight(
          "❌ AI service unavailable. Please contact support staff if the issue persists."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">AI Matching</h2>

      <form onSubmit={askAI}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your demand (e.g., need 200kg maize in Nakuru by Friday)"
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
