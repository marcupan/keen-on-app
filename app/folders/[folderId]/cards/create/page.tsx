'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { CardInputType, CreateCardValues } from '@/types/card';
import { CreateCardValidationSchema } from '@/validations/card';
import ProtectedPage from '@/components/ProtectedPage';
import FieldInfo from '@/components/ui/FieldInfo';
import { FolderQueryProps } from '@/types/folder';
import { useCreateCard } from '@/hooks/useCreateCard';

function CreateCardContent() {
	const { folderId } = useParams<FolderQueryProps>();

	const router = useRouter();

	const mutation = useCreateCard({
		folderId,
		onSuccess: () => {
			router.push(`/folders/${folderId}`);
		},
	});

	const form = useForm({
		defaultValues: {
			word: '',
			translation: '',
			image: '',
			sentence: '',
		},
		validators: {
			onChange: CreateCardValidationSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);

			router.push(`/dashboard/folders/${folderId}`);
		},
	});

	function TextInput({ name, label }: CardInputType<CreateCardValues>) {
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
				<TextInput label="Image URL" name="image" />
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

export default function CreateCardPage() {
	return (
		<ProtectedPage>
			<CreateCardContent />
		</ProtectedPage>
	);
}
