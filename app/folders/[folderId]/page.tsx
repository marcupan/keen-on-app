'use client';

import React, { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import CreateFolderValidationSchema from '@/validations/folder';

import { useFolder } from '@/hooks/useFolder';
import TextInput from '@/components/ui/TextInput';
import { FolderQueryProps } from '@/types/folder';

export default function FolderDetailsPage() {
	const { folderId } = useParams<FolderQueryProps>();

	const router = useRouter();

	const { query, mutation } = useFolder(folderId);

	const folder = query.data?.data.folder;

	const form = useForm({
		defaultValues: {
			name: folder ? folder.name : '',
			description: folder ? folder.description : '',
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
		if (folder) {
			form.reset({
				name: folder.name,
				description: folder.description,
			});
		}
	}, [folder, form]);

	if (query.isLoading) {
		return <p>Loading folder...</p>;
	}

	if (query.error) {
		return <p className="text-red-500">Error loading folder.</p>;
	}

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow">
			<h1 className="text-xl mb-4">Edit Folder</h1>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="name">
					{(field) => (
						<TextInput
							label="Folder Name"
							name={field.name}
							value={field.state.value}
							onChange={field.handleChange}
							onBlur={field.handleBlur}
						/>
					)}
				</form.Field>

				<form.Field name="description">
					{(field) => (
						<TextInput
							label="Description"
							name={field.name}
							value={field.state.value || ''}
							onChange={field.handleChange}
							onBlur={field.handleBlur}
						/>
					)}
				</form.Field>

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
					href={`/folders/${folderId}/cards/create`}
					className="inline-block px-4 py-2 bg-green-600 text-white"
				>
					Create Card
				</a>
			</div>
		</div>
	);
}
