"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Insight {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export default function AIInsightsPage() {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Insight[]>([]);

  // Fetch user insight history on load
  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/history/${user?.id}`
      );
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleAskAI = async () => {
    if (!query.trim()) return alert("Please type a question first.");
    if (!user) return alert("You must be logged in.");

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          question: query,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.insight.answer);
        setHistory((prev) => [data.insight, ...prev]); // prepend new insight
      } else {
        setResponse("No response from AI. Try again.");
      }
    } catch (error) {
      console.error(error);
      setResponse("⚠️ Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-12 px-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-center mb-4">
          🤖 Smart Harvest AI Insights
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Ask questions and get intelligent farming or foodbank insights.
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question here..."
            className="border border-gray-300 rounded-lg p-4 w-full h-32 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          <button
            onClick={handleAskAI}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Ask AI"}
          </button>
        </div>

        {response && (
          <div className="mt-4 bg-gray-100 border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">AI Insight:</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">🕘 Past Insights</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">No past insights yet.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-medium text-green-700">
                    Q: {item.question}
                  </p>
                  <p className="text-gray-700 mt-2">A: {item.answer}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
