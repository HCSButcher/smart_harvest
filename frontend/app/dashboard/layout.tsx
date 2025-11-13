// app/dashboard/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <div className="p-6">Loading...</div>;

  const role = (user as any)?.publicMetadata?.role || null;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <main className="flex-1 p-6 bg-gray-50 ">
        <UserButton />
        {children}
      </main>
    </div>
  );
}
