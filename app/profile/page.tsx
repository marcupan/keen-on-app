"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthCheck } from "@/hooks/useAuthCheck";

async function fetchUser() {
  const res = await fetch("/api/user/profile");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export default function ProfilePage() {
  const { data, error, isLoading } = useQuery(["userProfile"], fetchUser);

  useAuthCheck();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>Name - {data.name}</p>
    </div>
  );
}
