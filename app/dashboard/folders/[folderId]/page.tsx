'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import CreateFolderValidationSchema from '@/app/validations/folder';

interface Folder {
	id: string;
	name: string;
	description?: string;
}

type UpdateFolderValues = {
	name: string;
	description: string;
};

type UpdateFolderResponse = {
	message: string;
};

const mutationHeaders = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('token')}`,
};

const queryHeaders = {
	Authorization: `Bearer ${localStorage.getItem('token')}`,
};

export default function FolderDetailsPage() {
	const { folderId } = useParams() as { folderId: string };
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<Folder>({
		queryKey: ['folder', folderId],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders/${folderId}`,
				{
					headers: queryHeaders,
				}
			);
			if (!res.ok) throw new Error('Error fetching folder');
			return res.json() as Promise<Folder>;
		},
		enabled: !!folderId,
	});

	const mutation = useMutation<
		UpdateFolderResponse,
		Error,
		UpdateFolderValues
	>({
		mutationFn: async (updated: UpdateFolderValues) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders/${folderId}`,
				{
					method: 'PATCH',
					headers: mutationHeaders,
					body: JSON.stringify(updated),
				}
			);
			if (!res.ok) throw new Error('Error updating folder');

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
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

	useEffect(() => {
		if (data) {
			form.reset({
				name: data.name,
				description: data.description || '',
			});
		}
	}, [data, form]);

	function TextInput({
		label,
		name,
	}: {
		label: string;
		name: keyof UpdateFolderValues;
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

	if (isLoading) return <p>Loading folder...</p>;

	if (error) return <p className="text-red-500">Error loading folder.</p>;

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Folder</h1>
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
							{isSubmitting ? 'Saving...' : 'Save'}
						</button>
					)}
				</form.Subscribe>
			</form>
			<div className="mt-6">
				<a
					href={`/dashboard/folders/${folderId}/cards/create`}
					className="inline-block px-4 py-2 bg-green-600 text-white"
				>
					Create Card
				</a>
			</div>
		</div>
	);
}
