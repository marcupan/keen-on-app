import { useQuery } from '@tanstack/react-query';

import { fetchApi } from '@/lib/api-client';
import type { FoldersResponseType } from '@/types/folder';

export const useFolders = () => {
	return useQuery<FoldersResponseType>({
		queryKey: ['folders'],
		queryFn: async (): Promise<FoldersResponseType> => {
			const result = await fetchApi<FoldersResponseType>('/api/folders');

			if (result === null) {
				throw new Error(
					'Folders data is null or API returned no content.'
				);
			}

			return result;
		},
	});
};
