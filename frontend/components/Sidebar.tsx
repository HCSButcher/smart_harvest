"use client";

import React from "react";
import Link from "next/link";

export default function Sidebar({ role }: { role: string | null }) {
  const farmerLinks = [
    { href: "/dashboard/farmer", label: "Overview" },
    { href: "/dashboard/farmer/upload", label: "Upload Produce" },
    { href: "/dashboard/farmer/my-produce", label: "My Produce" },
    { href: "/dashboard/farmer/ai", label: "AI Advisor" },
  ];

  const foodbankLinks = [
    { href: "/dashboard/foodbank", label: "Overview" },
    { href: "/dashboard/foodbank/browse", label: "Browse Produce" },
    { href: "/dashboard/foodbank/ai", label: "AI Matching" },
  ];

  // ✅ Restored your full admin menu EXACTLY as you defined it
  const adminLinks = [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/farmers", label: "Farmers" },
    { href: "/dashboard/admin/foodbanks", label: "Foodbanks" },
    { href: "/dashboard/admin/produce", label: "Produce Inventory" },
    { href: "/dashboard/admin/users", label: "User Management" },
    { href: "/dashboard/admin/analytics", label: "Analytics" },
    { href: "/dashboard/admin/ai-usage", label: "AI Usage Stats" },
    { href: "/dashboard/admin/sales", label: "Sales Overview" },
  ];

  const links =
    role === "farmer"
      ? farmerLinks
      : role === "foodbank"
      ? foodbankLinks
      : adminLinks;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold">SmartHarvest</h3>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
