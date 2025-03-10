'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import CreateCardValidationSchema from '@/app/validations/card';

interface Card {
	id: string;
	word: string;
	translation: string;
	imageUrl?: string;
	sentence?: string;
}

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

const queryHeaders = {
	Authorization: `Bearer ${localStorage.getItem('token')}`,
};

export default function EditCardPage() {
	const { folderId, cardId } = useParams<QueryParams>();

	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<Card>({
		queryKey: ['card', cardId],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					headers: queryHeaders,
				}
			);

			if (!res.ok) {
				throw new Error('Error fetching card');
			}

			return res.json();
		},
		enabled: !!cardId,
	});

	const mutation = useMutation<UpdateCardResponse, Error, UpdateCardValues>({
		mutationFn: async (updated: UpdateCardValues) => {
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['card', cardId] });
		},
	});

	const form = useForm({
		defaultValues: {
			word: '',
			translation: '',
			imageUrl: '',
			sentence: '',
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
		if (data) {
			form.reset({
				word: data.word,
				translation: data.translation,
				imageUrl: data.imageUrl ?? '',
				sentence: data.sentence ?? '',
			});
		}
	}, [data, form]);

	function TextInput({
		label,
		name,
	}: {
		label: string;
		name: keyof UpdateCardValues;
	}) {
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
							type="text"
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
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();

					form.handleSubmit();
				}}
			>
				<TextInput label="Word" name="word" />
				<TextInput label="Translation" name="translation" />
				<TextInput label="Image URL" name="imageUrl" />
				<TextInput label="Sentence" name="sentence" />
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
