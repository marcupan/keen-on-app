import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, fetchApi } from '@/lib/api-client';
import { CreateFolderResponse, CreateFolderValues } from '@/types/folder';

export const useCreateFolder = () => {
	const queryClient = useQueryClient();

	return useMutation<CreateFolderResponse, ApiError, CreateFolderValues>({
		mutationFn: async (
			data: CreateFolderValues
		): Promise<CreateFolderResponse> => {
			const result = await fetchApi<CreateFolderResponse>(
				`/api/folders`,
				{
					method: 'POST',
					body: JSON.stringify(data),
				}
			);

			if (result === null) {
				throw new Error('Folder creation returned no content.');
			}

			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});
};
