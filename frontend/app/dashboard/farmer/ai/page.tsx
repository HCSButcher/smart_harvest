// app/dashboard/farmer/ai/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useUser } from "@clerk/nextjs";

export default function FarmerAI() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!user?.id) return alert("Sign in first");
    setLoading(true);
    try {
      const res = await api.post("/ai/insight", {
        produceList: [{ farmerId: user.id, question: input }],
      });
      setAnswer(res.data?.insight || "No response");
    } catch (err) {
      console.error(err);
      setAnswer("Error fetching insight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">AI Advisor</h2>
      <textarea
        placeholder="Ask the AI (e.g. best market price for tomatoes in Nakuru?)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={ask}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Thinking…" : "Ask AI"}
      </button>
      {answer && (
        <div className="mt-4 p-3 bg-gray-50 rounded border whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}
