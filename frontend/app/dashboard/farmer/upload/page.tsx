// app/dashboard/farmer/upload/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useUser } from "@clerk/nextjs";

export default function FarmerUpload() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [ai, setAi] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return alert("Sign in first");

    const payload = {
      farmerId: user.id,
      name,
      quantity: Number(quantity),
      location,
    };

    try {
      setLoading(true);
      // Save produce
      await api.post("/produce", payload);

      // Ask AI for tailored insight (we send list with one item)
      const aiRes = await api.post("/ai/insight", { produceList: [payload] });
      setAi(aiRes.data?.insight || "No insight returned");
      setName("");
      setQuantity("");
      setLocation("");
    } catch (err) {
      console.error(err);
      alert("Failed to save produce / call AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Upload Produce</h2>

      <form
        onSubmit={submit}
        className="bg-white p-4 rounded shadow max-w-md space-y-3"
      >
        <input
          className="w-full p-2 border rounded"
          placeholder="Produce name (e.g. Maize)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Quantity (kg)"
          type="number"
          value={quantity as any}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Location (e.g. Nakuru)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded"
        >
          {loading ? "Saving…" : "Upload & Ask AI"}
        </button>
      </form>

      {ai && (
        <div className="mt-4 p-3 bg-gray-50 rounded border">
          <h3 className="font-semibold">AI Insight</h3>
          <div className="whitespace-pre-wrap">{ai}</div>
        </div>
      )}
    </div>
  );
}
