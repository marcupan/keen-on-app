import { useQuery } from '@tanstack/react-query';

import { CardsResponseType } from '@/types/card';
import { fetchApi } from '@/lib/api-client';

export const useCards = (folderId: string | undefined) => {
	return useQuery<CardsResponseType>({
		queryKey: ['folders'],
		queryFn: async (): Promise<CardsResponseType> => {
			const result = await fetchApi<CardsResponseType>(
				`/api/folders/${folderId}/cards`
			);

			if (result === null) {
				throw new Error(
					'Folders data is null or API returned no content.'
				);
			}

			return result;
		},
	});
};
