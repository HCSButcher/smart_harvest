"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelectionPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const selectRole = async (role: "farmer" | "foodbank" | "admin") => {
    if (!user) return alert("Please sign in first.");
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "/api"}/set-role`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, role }),
        }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        await user.reload();
        router.push(`/dashboard/${role}`);
      } else {
        alert(json.error ?? "Failed to set role");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="p-8"> Loading...</div>;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-4"> Choose your role</h2>
        <p className="mb-6 text-gray-600">
          {" "}
          Select Farmer if you will list surplus. Select Food Bank if you will
          request produce
        </p>

        <div className="flex justify-center gap-4">
          <button
            disabled={loading}
            onClick={() => selectRole("farmer")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Saving..." : "Farmer"}
          </button>
          <button
            disabled={loading}
            onClick={() => selectRole("foodbank")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Food Bank"}
          </button>
        </div>
      </div>
    </main>
  );
}
