import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchApi } from '@/lib/api-client';

import type { CreateCardValues, CreateCardResponse } from '@/types';

export function useCreateCard(folderId: string) {
	const queryClient = useQueryClient();

	return useMutation<CreateCardResponse, Error, CreateCardValues>({
		mutationFn: (data) =>
			fetchApi('/api/cards', {
				method: 'POST',
				body: JSON.stringify({ ...data, folderId }),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards', folderId] });
		},
	});
}
