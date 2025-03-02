'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Folder {
	id: string;
	name: string;
	description?: string;
}

type FolderForm = {
	name: string;
	description?: string;
};

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
			if (!res.ok) {
				throw new Error('Error fetching folder');
			}
			return res.json();
		},
		{ enabled: !!folderId }
	);

	const { register, handleSubmit, reset } = useForm<FolderForm>();

	React.useEffect(() => {
		if (data) {
			reset({
				name: data.name,
				description: data.description,
			});
		}
	}, [data, reset]);

	const mutation = useMutation(
		async (updated: FolderForm) => {
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
			if (!res.ok) {
				throw new Error('Error updating folder');
			}
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['folder', folderId]);
				router.push('/dashboard');
			},
		}
	);

	const onSubmit = (formData: FolderForm) => {
		mutation.mutate(formData);
	};

	if (isLoading) return <p>Loading folder...</p>;
	if (error) return <p className="text-red-500">Error loading folder.</p>;

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Folder</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium">
						Folder Name
					</label>
					<input
						id="name"
						{...register('name', { required: true })}
						className="mt-1 w-full border p-2"
					/>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium"
					>
						Description
					</label>
					<textarea
						id="description"
						{...register('description')}
						className="mt-1 w-full border p-2"
					/>
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white"
					disabled={mutation.isLoading}
				>
					Save
				</button>
				{mutation.error && (
					<p className="text-red-500 mt-2">Error updating folder.</p>
				)}
			</form>

			{/* List of Cards */}
			<div className="mt-6">
				<a
					href={`/dashboard/folders/${folderId}/cards/create`}
					className="inline-block px-4 py-2 bg-green-600 text-white"
				>
					Create Card
				</a>
				{/* You could also fetch and display a list of cards here */}
			</div>
		</div>
	);
}
