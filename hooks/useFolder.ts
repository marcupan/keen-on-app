import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
	FolderResponseType,
	FolderType,
	UpdateFolderResponse,
} from '@/types/folder';

export function useFolder(folderId: string | undefined) {
	const queryClient = useQueryClient();

	const query = useQuery<FolderResponseType>({
		queryKey: ['folder', folderId],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders/${folderId}`,
				{
					credentials: 'include',
				}
			);

			if (!res.ok) {
				throw new Error('Error fetching folder');
			}

			return res.json();
		},
		enabled: !!folderId,
	});

	const mutation = useMutation<UpdateFolderResponse, Error, FolderType>({
		mutationFn: async (updated: FolderType) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders/${folderId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify(updated),
				}
			);

			if (!res.ok) {
				throw new Error('Error updating folder');
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
		},
	});

	return { query, mutation };
}
