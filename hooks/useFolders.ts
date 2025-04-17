import { useQuery } from '@tanstack/react-query';

import { FoldersResponseType } from '@/types/folder';

export const useFolders = () => {
	return useQuery<FoldersResponseType>({
		queryKey: ['folders'],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/folders`,
				{
					credentials: 'include',
				}
			);

			if (!res.ok) {
				throw new Error('Error fetching folders');
			}

			return res.json();
		},
	});
};
