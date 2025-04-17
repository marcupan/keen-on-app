import { useMutation, useQueryClient } from '@tanstack/react-query';

import { z } from 'zod';

import CreateFolderValidationSchema from '@/validations/folder';
import ApiErrorValidationSchema from '@/validations/errors';

export type CreateFolderValues = z.infer<typeof CreateFolderValidationSchema>;

type CreateFolderResponse = {
	message: string;
};

export const useCreateFolder = () => {
	const queryClient = useQueryClient();

	return useMutation<CreateFolderResponse, Error, CreateFolderValues>({
		mutationFn: async (data) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify(data),
				}
			);

			if (!res.ok) {
				let errorMessage = 'Error creating folder';

				try {
					const errorData = await res.json();
					const parsedError = ApiErrorValidationSchema.parse(errorData);
					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {}

				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});
};
