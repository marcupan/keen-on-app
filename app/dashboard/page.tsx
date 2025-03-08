'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Folder {
	id: string;
	name: string;
	description?: string;
}

export default function DashboardPage() {
	const { data, isLoading, error } = useQuery<Folder[]>({
		queryKey: ['folders'],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			if (!res.ok) {
				throw new Error('Error fetching folders');
			}
			return res.json() as Promise<Folder[]>;
		},
	});

	return (
		<div>
			<h1 className="text-2xl mb-4">Folders</h1>
			{isLoading && <p>Loading folders...</p>}
			{error && <p className="text-red-500">Failed to load folders.</p>}
			<div className="space-y-2">
				{data?.map((folder) => (
					<div key={folder.id} className="p-2 bg-white shadow">
						<a
							href={`/dashboard/folders/${folder.id}`}
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
				onClick={() =>
					(window.location.href = '/dashboard/folders/create')
				}
				className="mt-4 px-4 py-2 bg-blue-600 text-white"
			>
				Create Folder
			</button>
		</div>
	);
}
