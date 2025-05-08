import { UserType } from '@/types/user';

export type AuthContextType = {
	user: UserType | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (user: UserType) => void;
	logout: () => Promise<void>;
};
