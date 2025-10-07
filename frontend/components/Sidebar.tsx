"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function Sidebar({ role }: { role: string | null }) {
  const farmerLinks = [
    { href: "/dashboard/farmer", label: "Overview" },
    { href: "/dashboard/farmer/upload", label: "Upload Produce" },
    { href: "/dashboard/farmer/my-produce", label: "My Produce" },
    { href: "/dashboard/farmer/ai", label: "AI Advisor" },
  ];

  const foodbankLinks = [
    { href: "/dahsboard/foodbank", label: "Overview" },
    { href: "/dashboard/foodbank/browse", label: "Browse Produce" },
    { href: "/dashboard/foodbank/subscription", label: "Subcription" },
  ];

  const adminLinks = [{ href: "/dashboard/admin", label: "Overview" }];

  const links =
    role === "farmer"
      ? farmerLinks
      : role === "foodbank"
      ? foodbankLinks
      : adminLinks;
  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold"> SmartHarvest</h3>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="block px-3 py-2 rounded over:bg-gray-100"
          >
            {i.label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 border-t pt-4">
        <UserButton />
      </div>
    </aside>
  );
}
