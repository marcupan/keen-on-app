'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type FolderForm = {
	name: string;
	description?: string;
};

export default function CreateFolderPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FolderForm>();
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation(
		async (data: FolderForm) => {
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
				throw new Error('Error creating folder');
			}
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['folders']);
				router.push('/dashboard');
			},
		}
	);

	const onSubmit = (data: FolderForm) => {
		mutation.mutate(data);
	};

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Create Folder</h1>
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
					{errors.name && (
						<p className="text-red-500">Name is required</p>
					)}
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
					Create
				</button>
				{mutation.error && (
					<p className="text-red-500 mt-2">Error creating folder.</p>
				)}
			</form>
		</div>
	);
}
