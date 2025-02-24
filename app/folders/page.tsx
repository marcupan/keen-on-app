"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck"

const exampleFolders = [
    { id: "1", name: "Spanish Vocabulary" },
    { id: "2", name: "Chinese Phrases" },
];

export default function FoldersPage() {
  useAuthCheck();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Folders</h1>
      <ul className="list-disc list-inside">
        {exampleFolders.map((folder) => (
          <li key={folder.id}>
            <a
              href={`/folders/${folder.id}`}
              className="text-blue-600 hover:underline"
            >
              {folder.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
