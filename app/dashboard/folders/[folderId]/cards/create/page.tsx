'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const CreateCardSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	translation: z.string().min(1, 'Translation is required'),
	imageUrl: z.string(),
	sentence: z.string(),
});

type CreateCardValues = z.infer<typeof CreateCardSchema>; // { word: string; translation: string; imageUrl: string; sentence: string }

type CreateCardResponse = {
	message: string;
};

const BackendErrorSchema = z.object({
	status: z.string(),
	errors: z.array(
		z.object({
			code: z.string(),
			minimum: z.number().optional(),
			type: z.string(),
			inclusive: z.boolean().optional(),
			exact: z.boolean().optional(),
			message: z.string(),
			path: z.array(z.string()),
		})
	),
});

export default function CreateCardPage() {
	const { folderId } = useParams() as { folderId: string };
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<CreateCardResponse, Error, CreateCardValues>({
		mutationFn: async (data: CreateCardValues) => {
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
				let errorMessage = 'Error creating card';
				try {
					const errorData = await res.json();
					const parsedError = BackendErrorSchema.parse(errorData);
					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {}

				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards', folderId] });
		},
	});

	const form = useForm({
		defaultValues: {
			word: '',
			translation: '',
			imageUrl: '',
			sentence: '',
		},
		validators: { onChange: CreateCardSchema },
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
			router.push(`/dashboard/folders/${folderId}`);
		},
	});

	function TextInput({
		label,
		name,
	}: {
		label: string;
		name: keyof CreateCardValues;
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
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="border p-2 w-full"
						/>
					</div>
				)}
			</form.Field>
		);
	}

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Create Card</h1>
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
							{isSubmitting ? 'Creating...' : 'Create'}
						</button>
					)}
				</form.Subscribe>
			</form>
			{mutation.isError && (
				<p className="text-red-500 mt-2">
					{(mutation.error as Error).message}
				</p>
			)}
		</div>
	);
}
