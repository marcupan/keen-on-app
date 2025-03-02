'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Card {
	id: string;
	word: string;
	translation: string;
	imageUrl?: string;
	sentence?: string;
}

type CardForm = {
	word: string;
	translation: string;
	imageUrl?: string;
	sentence?: string;
};

export default function EditCardPage() {
	const { folderId, cardId } = useParams() as {
		folderId: string;
		cardId: string;
	};
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<Card>(
		['card', cardId],
		async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			if (!res.ok) {
				throw new Error('Error fetching card');
			}
			return res.json();
		},
		{ enabled: !!cardId }
	);

	const { register, handleSubmit, reset } = useForm<CardForm>();

	React.useEffect(() => {
		if (data) {
			reset({
				word: data.word,
				translation: data.translation,
				imageUrl: data.imageUrl,
				sentence: data.sentence,
			});
		}
	}, [data, reset]);

	const mutation = useMutation(
		async (updated: CardForm) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(updated),
				}
			);
			if (!res.ok) {
				throw new Error('Error updating card');
			}
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['card', cardId]);
				router.push(`/dashboard/folders/${folderId}`);
			},
		}
	);

	const onSubmit = (formData: CardForm) => {
		mutation.mutate(formData);
	};

	if (isLoading) return <p>Loading card...</p>;
	if (error) return <p className="text-red-500">Error loading card.</p>;

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Card</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label htmlFor="word" className="block text-sm font-medium">
						Word
					</label>
					<input
						id="word"
						{...register('word', { required: true })}
						className="mt-1 w-full border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="translation"
						className="block text-sm font-medium"
					>
						Translation
					</label>
					<input
						id="translation"
						{...register('translation', { required: true })}
						className="mt-1 w-full border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="imageUrl"
						className="block text-sm font-medium"
					>
						Image URL
					</label>
					<input
						id="imageUrl"
						{...register('imageUrl')}
						className="mt-1 w-full border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="sentence"
						className="block text-sm font-medium"
					>
						Sentence
					</label>
					<textarea
						id="sentence"
						{...register('sentence')}
						className="mt-1 w-full border p-2"
					/>
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white"
					disabled={mutation.isLoading}
				>
					Save
				</button>
				{mutation.error && (
					<p className="text-red-500 mt-2">Error updating card.</p>
				)}
			</form>
		</div>
	);
}
