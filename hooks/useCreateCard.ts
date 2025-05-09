import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateCardResponse, CreateCardValues } from '@/types/card';
import { fetchApi } from '@/lib/api-client'; // Assuming fetchApi handles base URL and credentials

interface UseCreateCardOptions {
	folderId: string;
	onSuccess?: (data: CreateCardResponse) => void;
	onError?: (error: Error) => void;
}

export function useCreateCard({
	folderId,
	onSuccess,
	onError,
}: UseCreateCardOptions) {
	const queryClient = useQueryClient();

	return useMutation<CreateCardResponse, Error, CreateCardValues>({
		mutationFn: async (cardData: CreateCardValues) => {
			const result = await fetchApi<CreateCardResponse>('/api/cards', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...cardData, folderId }),
			});

			if (!result) {
				throw new Error('Failed to create card. No response.');
			}

			return result;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['cards', folderId] });

			if (onSuccess) {
				onSuccess(data);
			}
		},
		onError: (error) => {
			if (onError) {
				onError(error);
			} else {
				console.error('Create card mutation failed:', error);
			}
		},
	});
}
