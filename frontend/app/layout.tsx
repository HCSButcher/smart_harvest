import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export const metadata = {
  title: "Smart Harvest",
  description: "AI-powered smart agriculture platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 text-gray-900">
        <ClerkProvider publishableKey={clerkPub}>{children}</ClerkProvider>
      </body>
    </html>
  );
}
