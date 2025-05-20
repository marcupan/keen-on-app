import { useQuery } from '@tanstack/react-query';

import { CardsResponseType } from '@/types/card';
import { fetchApi } from '@/lib/api-client';

type UseCardsParams = {
	folderId?: string;
	skip?: number;
	take?: number;
	sort?: string;
	order?: 'ASC' | 'DESC';
	search?: string;
};

export const useCards = ({
	folderId,
	skip = 0,
	take = 10,
	sort,
	order = 'ASC',
	search,
}: UseCardsParams = {}) => {
	return useQuery<CardsResponseType>({
		queryKey: ['cards', { folderId, skip, take, sort, order, search }],
		queryFn: async (): Promise<CardsResponseType> => {
			const searchParams = new URLSearchParams();

			if (folderId) searchParams.set('folderId', folderId);
			if (skip) searchParams.set('skip', skip.toString());
			if (take) searchParams.set('take', take.toString());
			if (sort) searchParams.set('sort', sort);
			if (order) searchParams.set('order', order);
			if (search) searchParams.set('search', search);

			const queryString = searchParams.toString();
			const url = `/api/cards${queryString ? `?${queryString}` : ''}`;

			const result = await fetchApi<CardsResponseType>(url);

			if (result === null) {
				throw new Error(
					'Cards data is null or API returned no content.'
				);
			}

			return result;
		},
	});
};
