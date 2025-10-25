// app/role-selection/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelection() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const selectRole = async (role: "farmer" | "foodbank" | "admin") => {
    if (!user) return alert("Sign in first");
    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api"
        }/clerk/set-role`,
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
        alert(json.error || "Failed to set role");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl mb-4">Choose your role</h2>
        <div className="flex gap-3 justify-center">
          <button
            disabled={loading}
            onClick={() => selectRole("farmer")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Farmer
          </button>
          <button
            disabled={loading}
            onClick={() => selectRole("foodbank")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Food Bank
          </button>
          <button
            disabled={loading}
            onClick={() => selectRole("admin")}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
