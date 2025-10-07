// app/page.tsx
"use client";

import Link from "next/link";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      // If role already set, go to dashboard; otherwise go to role selection
      const role = (user as any)?.publicMetadata?.role;
      if (role) router.push(`/dashboard/${role}`);
      else router.push("/role-selection");
    }
  }, [isSignedIn, user, isLoaded, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">🌾 SmartHarvest</h1>
        <p className="text-gray-600 mb-6">
          AI-powered recommendations for surplus distribution — connect farmers
          with food banks and reduce waste.
        </p>

        <div className="flex justify-center gap-4">
          <SignInButton>
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Sign up
            </button>
          </SignUpButton>
          <Link href="/role-selection"></Link>
        </div>

        <div className="mt-8 text-left bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Guide</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            <li>
              Sign up, choose your role, then explore the role-specific
              dashboards.
            </li>
            <li>
              AI features call the backend `/api/ai/recommend` endpoint (backend
              must proxy to OpenAI).
            </li>
            <li>
              Payments are handled by IntaSend via your backend — frontend will
              open a checkout session returned by backend.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
