'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useField } from '@tanstack/react-form';

export default function CreateCardPage() {
	const { folderId } = useParams() as { folderId: string };
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation(
		async (data: {
			word: string;
			translation: string;
			imageUrl?: string;
			sentence?: string;
		}) => {
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
			if (!res.ok) throw new Error('Error creating card');
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['cards', folderId]);
			},
		}
	);

	const {
		Form,
		meta: { canSubmit, isSubmitting },
	} = useForm({
		onSubmit: async (values) => {
			await mutation.mutateAsync(values);
			router.push(`/dashboard/folders/${folderId}`);
		},
		defaultValues: {
			word: '',
			translation: '',
			imageUrl: '',
			sentence: '',
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
			<h1 className="text-xl mb-4">Create Card</h1>
			<Form>
				<TextInput label="Word" name="word" />
				<TextInput label="Translation" name="translation" />
				<TextInput label="Image URL" name="imageUrl" />
				<TextInput label="Sentence" name="sentence" />
				{mutation.isError && (
					<p className="text-red-500">Error creating card.</p>
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
