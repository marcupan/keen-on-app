'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

type FolderType = {
	id: string;
	name: string;
	description?: string;
};

type FoldersResponseType = {
	status: 'success' | 'error' | 'fail';
	data: {
		folders: FolderType[];
	};
	meta: {
		skip: number;
		take: number;
	};
};

export default function DashboardPage() {
	const router = useRouter();

	const {
		data,
		isLoading,
		error,
	} = useQuery<FoldersResponseType>({
		queryKey: ['folders'],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders`,
				{
					credentials: 'include',
				}
			);

			if (!res.ok) {
				throw new Error('Error fetching folders');
			}

			return res.json();
		},
	});

	const folders = data ? data.data.folders : [];

	return (
		<div>
			<h1 className="text-2xl mb-4">Folders</h1>

			{isLoading && <p>Loading folders...</p>}

			{error && <p className="text-red-500">Failed to load folders.</p>}

			<div className="space-y-2">
				{folders.map((folder) => (
					<div key={folder.id} className="p-2 bg-white shadow">
						<a
							href={`/folders/${folder.id}`}
							className="font-semibold underline"
						>
							{folder.name}
						</a>
						{folder.description && (
							<p className="text-sm">{folder.description}</p>
						)}
					</div>
				))}
			</div>

			<button
				className="mt-4 px-4 py-2 bg-blue-600 text-white"
				onClick={() => router.push('/folders/create')}
			>
				Create Folder
			</button>
		</div>
	);
}
