"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white flex justify-between p-4 shadow">
      <Link href="/" className="text-xl font-bold">
        🌾 Smart Harvest
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/subscription" className="hover:underline">
          Subscriptions
        </Link>
        <UserButton />
      </div>
    </nav>
  );
}
