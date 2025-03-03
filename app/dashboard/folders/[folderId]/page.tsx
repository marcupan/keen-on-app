'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useField } from '@tanstack/react-form';

interface Folder {
	id: string;
	name: string;
	description?: string;
}

export default function FolderDetailsPage() {
	const { folderId } = useParams() as { folderId: string };
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<Folder>(
		['folder', folderId],
		async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders/${folderId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			if (!res.ok) throw new Error('Error fetching folder');
			return res.json();
		},
		{ enabled: !!folderId }
	);

	const {
		Form,
		meta: { canSubmit, isSubmitting },
		setValues,
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

	React.useEffect(() => {
		if (data) {
			setValues({
				name: data.name || '',
				description: data.description || '',
			});
		}
	}, [data, setValues]);

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

	const mutation = useMutation(
		async (updated: { name: string; description?: string }) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders/${folderId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(updated),
				}
			);
			if (!res.ok) throw new Error('Error updating folder');
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['folder', folderId]);
			},
		}
	);

	if (isLoading) return <p>Loading folder...</p>;
	if (error) return <p className="text-red-500">Error loading folder.</p>;

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Folder</h1>
			<Form>
				<TextInput label="Folder Name" name="name" />
				<TextInput label="Description" name="description" />
				{mutation.isError && (
					<p className="text-red-500">Error updating folder.</p>
				)}
				<button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white"
				>
					{isSubmitting ? 'Saving...' : 'Save'}
				</button>
			</Form>
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
