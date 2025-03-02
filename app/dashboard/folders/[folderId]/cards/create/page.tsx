'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type CardForm = {
	word: string;
	translation: string;
	imageUrl?: string;
	sentence?: string;
};

export default function CreateCardPage() {
	const { folderId } = useParams() as { folderId: string };
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation(
		async (data: CardForm) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify({ ...data, folderId }),
				}
			);
			if (!res.ok) {
				throw new Error('Error creating card');
			}
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['cards', folderId]);
				router.push(`/dashboard/folders/${folderId}`);
			},
		}
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CardForm>();

	const onSubmit = (formData: CardForm) => {
		mutation.mutate(formData);
	};

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Create Card</h1>
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
					{errors.word && (
						<p className="text-red-500">Word is required</p>
					)}
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
					{errors.translation && (
						<p className="text-red-500">Translation is required</p>
					)}
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
					Create
				</button>
				{mutation.error && (
					<p className="text-red-500 mt-2">Error creating card.</p>
				)}
			</form>
		</div>
	);
}
