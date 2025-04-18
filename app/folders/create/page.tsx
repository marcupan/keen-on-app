'use client';

import { useRouter } from 'next/navigation';

import { CreateFolderValues, useCreateFolder } from '@/hooks/useCreateFolder';
import { CreateFolderForm } from '@/components/CreateFolderForm';

export default function CreateFolderPage() {
	const router = useRouter();
	const mutation = useCreateFolder();

	const handleSubmit = async (values: CreateFolderValues) => {
		await mutation.mutateAsync(values);
		router.push('/folders');
	};

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
			<h1 className="text-xl font-semibold mb-4">Create Folder</h1>

			<CreateFolderForm
				onSubmit={handleSubmit}
				isSubmitting={mutation.isPending}
			/>

			{mutation.isError && (
				<p className="text-red-500 mt-2">
					{mutation.error.message}
				</p>
			)}
		</div>
	);
}
