export interface User {
	name: string;
	email: string;
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (user: User) => void;
	logout: () => void;
}
