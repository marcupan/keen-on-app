'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useField } from '@tanstack/react-form';

interface Card {
	id: string;
	word: string;
	translation: string;
	imageUrl?: string;
	sentence?: string;
}

export default function EditCardPage() {
	const { folderId, cardId } = useParams() as {
		folderId: string;
		cardId: string;
	};
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<Card>(
		['card', cardId],
		async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			if (!res.ok) throw new Error('Error fetching card');
			return res.json();
		},
		{ enabled: !!cardId }
	);

	const {
		Form,
		meta: { canSubmit, isSubmitting },
		setValues,
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

	React.useEffect(() => {
		if (data) {
			setValues({
				word: data.word,
				translation: data.translation,
				imageUrl: data.imageUrl ?? '',
				sentence: data.sentence ?? '',
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
		async (updated: {
			word: string;
			translation: string;
			imageUrl?: string;
			sentence?: string;
		}) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${cardId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(updated),
				}
			);
			if (!res.ok) throw new Error('Error updating card');
			return res.json();
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['card', cardId]);
			},
		}
	);

	if (isLoading) return <p>Loading card...</p>;
	if (error) return <p className="text-red-500">Error loading card.</p>;

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Card</h1>
			<Form>
				<TextInput label="Word" name="word" />
				<TextInput label="Translation" name="translation" />
				<TextInput label="Image URL" name="imageUrl" />
				<TextInput label="Sentence" name="sentence" />
				{mutation.isError && (
					<p className="text-red-500">Error updating card.</p>
				)}
				<button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white"
				>
					{isSubmitting ? 'Saving...' : 'Save'}
				</button>
			</Form>
		</div>
	);
}
