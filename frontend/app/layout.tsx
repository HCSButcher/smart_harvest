import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export const metadata = {
  title: "Smart Harvest",
  description: "SmartHarvest - AI-powered surplus distribution",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return (
    <html lang="en">
      <head />
      <body>
        <ClerkProvider publishableKey={clerkPub}>{children}</ClerkProvider>
      </body>
    </html>
  );
}
