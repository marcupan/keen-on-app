"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthCheck() {
  const router = useRouter();

  useEffect(() => {
    // For demonstration, let's say we check localStorage
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
}
