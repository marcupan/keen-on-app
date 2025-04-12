'use client';

import React, { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import CreateCardValidationSchema from '@/validations/card';

type UpdateCardValues = {
	word: string;
	translation: string;
	imageUrl: string;
	sentence: string;
};

type UpdateCardResponse = {
	message: string;
};

type QueryParams = {
	folderId: string;
	cardId: string;
};

type CardInputType = {
	name: keyof UpdateCardValues;
	label: string;
	type?: 'text' | 'file';
};

export default function EditCardPage() {
	const { folderId, cardId } = useParams<QueryParams>();

	const router = useRouter();

	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ['card', cardId],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					credentials: 'include',
				}
			);

			if (!res.ok) {
				throw new Error('Error fetching card');
			}

			return res.json();
		},
		enabled: !!cardId,
	});

	const cardData = data.data.card;

	console.log(data.data.card);

	const mutation = useMutation<UpdateCardResponse, Error, UpdateCardValues>({
		mutationFn: async (updated: UpdateCardValues) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(updated),
				}
			);

			if (!res.ok) {
				throw new Error('Error updating card');
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['card', cardId] });
		},
	});

	const form = useForm({
		defaultValues: {
			word: cardData.word,
			translation: cardData.translation,
			imageUrl: cardData.imageUrl ?? '',
			sentence: cardData.sentence ?? '',
		},
		validators: {
			onChange: CreateCardValidationSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);

			router.push(`/dashboard/folders/${folderId}`);
		},
	});

	useEffect(() => {
		if (cardData) {
			form.reset({
				word: cardData.word,
				translation: cardData.translation,
				imageUrl: cardData.imageUrl ?? '',
				sentence: cardData.sentence ?? '',
			});
		}
	}, [cardData, form]);

	function TextInput({ name, label, type = 'text' }: CardInputType) {
		return (
			<form.Field name={name}>
				{(field) => (
					<div className="mb-4">
						<label
							htmlFor={field.name}
							className="block text-sm font-medium mb-1"
						>
							{label}
						</label>
						<input
							id={field.name}
							name={field.name}
							type={type}
							value={field.state.value}
							className="border p-2 w-full"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</div>
				)}
			</form.Field>
		);
	}

	if (isLoading) {
		return <p>Loading card...</p>;
	}

	if (error) {
		return <p className="text-red-500">Error loading card.</p>;
	}

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Card</h1>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();

					form.handleSubmit();
				}}
			>
				<TextInput name="word" label="Word" />
				<TextInput name="translation" label="Translation" />
				<TextInput name="imageUrl" type="file" label="Image URL" />
				<TextInput name="sentence" label="Sentence" />

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							disabled={!canSubmit || isSubmitting}
							className="px-4 py-2 bg-blue-600 text-white"
						>
							{isSubmitting ? 'Saving...' : 'Save'}
						</button>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
}
