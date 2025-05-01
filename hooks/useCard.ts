import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	CardResponse,
	UpdateCardResponse,
	UpdateCardValues,
} from '@/types/card';
import { fetchApi } from '@/lib/api-client';

export function useCard(cardId: string | undefined) {
	const queryClient = useQueryClient();

	const query = useQuery<CardResponse, Error>({
		queryKey: ['card', cardId],
		queryFn: async (): Promise<CardResponse> => {
			const result = await fetchApi<CardResponse>(`/api/cards/${cardId}`);

			if (result === null) {
				throw new Error(
					`Card data for ID ${cardId} is null or not found.`
				);
			}

			return result;
		},
		enabled: !!cardId,
	});

	const mutation = useMutation<UpdateCardResponse, Error, UpdateCardValues>({
		mutationFn: async (
			updated: UpdateCardValues
		): Promise<UpdateCardResponse> => {
			const result = await fetchApi<UpdateCardResponse>(
				`/api/cards/${cardId}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updated),
				}
			);

			if (result === null) {
				throw new Error(
					`Update operation for card ID ${cardId} returned no content.`
				);
			}

			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['card', cardId] });
		},
	});

	return { query, mutation };
}
