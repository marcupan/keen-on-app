'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const CreateFolderSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
});

type CreateFolderValues = z.infer<typeof CreateFolderSchema>;

type CreateFolderResponse = {
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

export default function CreateFolderPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<CreateFolderResponse, Error, CreateFolderValues>(
		async (data: CreateFolderValues) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(data),
				}
			);
			if (!res.ok) {
				let errorMessage = 'Error creating folder';
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
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['folders']);
			},
		}
	);

	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
		},
		validators: { onChange: CreateFolderSchema },
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
			router.push('/dashboard');
		},
	});

	// A helper component for text inputs using our form instance.
	function TextInput({ label, name }: { label: string; name: string }) {
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
			<h1 className="text-xl mb-4">Create Folder</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<TextInput label="Folder Name" name="name" />
				<TextInput label="Description" name="description" />
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
