'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useField } from '@tanstack/react-form';

export default function CreateFolderPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation(
		async (data: { name: string; description?: string }) => {
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
			if (!res.ok) throw new Error('Error creating folder');
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['folders']);
			},
		}
	);

	const {
		Form,
		meta: { canSubmit, isSubmitting },
	} = useForm({
		onSubmit: async (values) => {
			await mutation.mutateAsync(values);
			router.push('/dashboard');
		},
		defaultValues: {
			name: '',
			description: '',
		},
	});

	function TextInput({ label, name }: { label: string; name: string }) {
		const { getInputProps } = useField(name);
		return (
			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">
					{label}
				</label>
				<input
					{...getInputProps({ type: 'text' })}
					className="border p-2 w-full"
				/>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Create Folder</h1>
			<Form>
				<TextInput label="Folder Name" name="name" />
				<TextInput label="Description" name="description" />
				{mutation.isError && (
					<p className="text-red-500">Error creating folder.</p>
				)}
				<button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white"
				>
					{isSubmitting ? 'Creating...' : 'Create'}
				</button>
			</Form>
		</div>
	);
}
