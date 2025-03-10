'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import { z } from 'zod';

import CreateFolderValidationSchema from '@/app/validations/folder';
import ApiErrorValidationSchema from '@/app/validations/errors';
import FieldInfo from '@/app/components/FieldInfo';

type CreateFolderValues = z.infer<typeof CreateFolderValidationSchema>;

type CreateFolderResponse = {
	message: string;
};

export default function CreateFolderPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<
		CreateFolderResponse,
		Error,
		CreateFolderValues
	>({
		mutationFn: async (data) => {
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
					const parsedError =
						ApiErrorValidationSchema.parse(errorData);

					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {}

				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});

	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
		},
		validators: {
			onChange: CreateFolderValidationSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);

			router.push('/dashboard');
		},
	});

	function TextInput({
		label,
		name,
	}: {
		label: string;
		name: 'name' | 'description';
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
						<FieldInfo field={field} />
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
