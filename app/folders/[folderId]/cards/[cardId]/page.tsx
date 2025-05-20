'use client';

import React, { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { CardInputType, CardQueryParams, UpdateCardValues } from '@/types/card';
import { CreateCardValidationSchema } from '@/validations/card';
import ProtectedPage from '@/components/ProtectedPage';
import { useCard } from '@/hooks/useCard';
import TextInput from '@/components/ui/TextInput';

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

	function InputField({
		name,
		label,
		type = 'text',
	}: CardInputType<UpdateCardValues>) {
		return (
			<form.Field name={name}>
				{(field) => (
					<TextInput
						label={label}
						name={field.name}
						type={type}
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
					/>
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
				<InputField name="word" label="Word" />
				<InputField name="translation" label="Translation" />
				<InputField name="image" type="file" label="Image URL" />
				<InputField name="sentence" label="Sentence" />

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
