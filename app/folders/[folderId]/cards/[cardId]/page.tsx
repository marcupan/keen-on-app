'use client';

import React, { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { CardInputType, CardQueryParams, UpdateCardValues } from '@/types/card';
import { CreateCardValidationSchema } from '@/validations/card';
import ProtectedPage from '@/components/ProtectedPage';
import { useCard } from '@/hooks/useCard';

function EditCardContent() {
	const { folderId, cardId } = useParams<CardQueryParams>();

	const router = useRouter();

	const { query: { data, isLoading, error }, mutation } = useCard(cardId);

	const cardData = data?.data.card;

	const form = useForm({
		defaultValues: {
			word: cardData?.word ?? '',
			translation: cardData?.translation ?? '',
			image: cardData?.image ?? '',
			sentence: cardData?.translation ?? '',
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
				image: cardData.image ?? '',
				sentence: cardData.translation ?? '',
			});
		}
	}, [cardData, form]);

	function TextInput({
		name,
		label,
		type = 'text',
	}: CardInputType<UpdateCardValues>) {
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
				<TextInput name="image" type="file" label="Image URL" />
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

export default function EditCardPage() {
	return (
		<ProtectedPage>
			<EditCardContent />
		</ProtectedPage>
	);
}
