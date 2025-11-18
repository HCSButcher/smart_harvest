// app/dashboard/farmer/upload/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useUser } from "@clerk/nextjs";

export default function FarmerUpload() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [contact, setContact] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return alert("Sign in first");

    const payload = {
      farmerId: user.id,
      price,
      name,
      quantity: Number(quantity),
      contact: Number(contact),
      location,
    };

    try {
      setLoading(true);
      // Save produce
      await api.post("/produce", payload);
      setName("");
      setQuantity("");
      setContact("");
      setPrice("");
      setLocation("");
      alert("Produce saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save produce ");
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
          placeholder="Contact (e.g +254748092687"
          type="number"
          value={contact}
          onChange={(e) => setContact(Number(e.target.value))}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Price in (Ksh)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
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
          {loading ? "Saving…" : "Upload Produce"}
        </button>
      </form>
    </div>
  );
}
