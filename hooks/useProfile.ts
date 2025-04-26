import { useQuery } from '@tanstack/react-query';

import { fetchApi } from '@/lib/api-client';
import type { UserProfile, UserResponseType } from '@/types/user';
import { useAuth } from '@/lib/auth';

export function useProfile() {
	const { isAuthenticated } = useAuth();

	return useQuery<{ data: { user: UserProfile } }>({
		queryKey: ['profile'],
		queryFn: async () => {
			const result = await fetchApi<UserResponseType | null>(
				'/api/user/profile'
			);

			if (result === null) {
				throw new Error('Profile data is null');
			}

			return result;
		},
		enabled: isAuthenticated,
	});
}
