"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";

const exampleCards = [
  { id: "101", word: "Hola", translation: "Hello" },
  { id: "102", word: "Adiós", translation: "Goodbye" },
];

export default function CardsPage() {
  useAuthCheck();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cards</h1>
      <ul className="list-disc list-inside">
        {exampleCards.map((card) => (
          <li key={card.id}>
            <a
              href={`/cards/${card.id}`}
              className="text-blue-600 hover:underline"
            >
              {card.word} - {card.translation}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
