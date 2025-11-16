"use client";

import React, { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // In future you could fetch current user/role here
  const role = "admin";

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar role={role} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}