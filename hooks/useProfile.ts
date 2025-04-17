import { useQuery } from '@tanstack/react-query';

import { fetchApi } from '@/lib/api-client';
import type { UserProfile } from '@/types/user';
import { useAuth } from '@/lib/auth';

export function useProfile() {
	const { isAuthenticated } = useAuth();

	return useQuery<{ data: { user: UserProfile } }>({
		queryKey: ['profile'],
		queryFn: () => fetchApi('/api/user/profile'),
		enabled: isAuthenticated,
	});
}
