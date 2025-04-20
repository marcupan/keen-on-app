'use client';

import { useRouter } from 'next/navigation';

import { useFolders } from '@/hooks/useFolders';
import { FolderItem } from '@/components/FolderItem';

export default function FoldersPage() {
	const router = useRouter();
	const { data, isLoading, error } = useFolders();

	const folders = data?.data.folders ?? [];

	return (
		<div>
			<h1 className="text-2xl mb-4">Folders</h1>

			{isLoading && <p>Loading folders...</p>}

			{error && <p className="text-red-500">Failed to load folders.</p>}

			<div className="space-y-2">
				{folders.map((folder) => (
					<FolderItem key={folder.name} folder={folder} />
				))}
			</div>

			<button
				className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
				onClick={() => router.push('/folders/create')}
			>
				Create Folder
			</button>
		</div>
	);
}
