"use client";

import { useParams } from "next/navigation";

import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function FolderDetailPage() {
  useAuthCheck();
  const params = useParams();
  const folderId = params.folderId;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Folder Detail</h1>
      <p>Folder ID: {folderId}</p>

      <p>Folders data</p>
    </div>
  );
}
