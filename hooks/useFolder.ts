import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
	FolderResponseType,
	FolderType,
	UpdateFolderResponse,
} from '@/types/folder';
import { fetchApi } from '@/lib/api-client';

export function useFolder(folderId: string | undefined) {
	const queryClient = useQueryClient();

	const query = useQuery<FolderResponseType>({
		queryKey: ['folder', folderId],
		queryFn: async (): Promise<FolderResponseType> => {
			const result = await fetchApi<FolderResponseType>(
				`/api/folders/${folderId}`
			);

			if (result === null) {
				throw new Error(
					`Folder data for ID ${folderId} is null or not found.`
				);
			}

			return result;
		},
		enabled: !!folderId,
	});

	const mutation = useMutation<UpdateFolderResponse, Error, FolderType>({
		mutationFn: async (
			updated: FolderType
		): Promise<UpdateFolderResponse> => {
			const result = await fetchApi<UpdateFolderResponse>(
				`/api/folders/${folderId}`,
				{
					method: 'PATCH',
					body: JSON.stringify(updated),
				}
			);

			if (result === null) {
				throw new Error(
					`Update operation for folder ID ${folderId} returned no content.`
				);
			}

			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});

	return { query, mutation };
}
