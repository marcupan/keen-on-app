"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function HomePage() {
  useAuthCheck(); // This will redirect if not logged in

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome Home!</h1>
      <p>You are logged in. Enjoy your content!</p>
    </div>
  );
}
