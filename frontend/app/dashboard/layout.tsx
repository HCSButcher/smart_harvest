// app/dashboard/layout.tsx
"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/");
    // If user has role and is trying to access wrong dashboard path, allow inner pages to handle it.
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <div className="p-6">Loading dashboard…</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={(user as any)?.publicMetadata?.role || null} />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
