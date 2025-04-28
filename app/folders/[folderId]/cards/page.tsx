'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import ProtectedPage from '@/components/ProtectedPage';
import { FolderQueryProps } from '@/types/folder';
import { CardsResponseType } from '@/types/card';

function CardsContent() {
	const params = useParams<FolderQueryProps>();

	const router = useRouter();

	const { data, isLoading, error } = useQuery<CardsResponseType, Error>({
		queryKey: ['cards'],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards`,
				{
					credentials: 'include',
				}
			);

			if (!res.ok) {
				throw new Error(
					`Error fetching cards: ${res.status} ${res.statusText}`
				);
			}

			return res.json();
		},
	});

	const cards = data?.data?.cards ?? [];

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-semibold text-gray-800">
					My Cards
				</h1>{' '}
				<button
					className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-150"
					onClick={() =>
						router.push(
							`/folders/${params.folderId}/cards/generate`
						)
					}
				>
					Create New Card
				</button>
			</div>

			{isLoading && <p className="text-gray-500">Loading cards...</p>}

			{error && (
				<p className="text-red-600 bg-red-100 p-3 rounded border border-red-300">
					Failed to load cards: {error.message}
				</p>
			)}

			{!isLoading && !error && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{cards.length > 0 ? (
						cards.map((card) => (
							<div
								key={card.id}
								className="p-4 bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
								onClick={() =>
									router.push(
										`/folders/${params.folderId}/cards/${card.id}`
									)
								}
							>
								{card.image && (
									<img
										src={card.image}
										alt={`Image for ${card.word}`}
										className="w-full h-32 object-contain mb-3 bg-gray-100 rounded"
										loading="lazy"
									/>
								)}
								<h3
									className="font-semibold text-lg text-gray-800 truncate"
									title={card.word}
								>
									{card.word}
								</h3>
								<p
									className="text-sm text-gray-600 truncate"
									title={card.translation}
								>
									{card.translation}
								</p>
								{card.createdAt && (
									<p className="text-xs text-gray-400 mt-2">
										Created:{' '}
										{new Date(
											card.createdAt
										).toLocaleDateString()}
									</p>
								)}
							</div>
						))
					) : (
						<p className="text-gray-500 col-span-full text-center py-10">
							You haven&#39;t created any cards yet.
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export default function CardsPage() {
	return (
		<ProtectedPage>
			<CardsContent />
		</ProtectedPage>
	);
}
