"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function ProfilePage() {
  useAuthCheck();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>Show user profile data here.</p>
    </div>
  );
}
