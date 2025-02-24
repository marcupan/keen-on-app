"use client";

import { useParams } from "next/navigation";

import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function CardDetailPage() {
  useAuthCheck();

  const { cardId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Card Detail</h1>
      <p>Card ID: {cardId}</p>
      <p>Card details</p>
    </div>
  );
}
