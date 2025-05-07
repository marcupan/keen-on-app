import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

import { UserProfile, UserResponseType } from '@/types/user';
import { ApiError, fetchApi } from '@/lib/api-client';

export interface AuthContextType {
	user: UserProfile | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (user: UserProfile) => void;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchCurrentSessionUser() {
			try {
				setIsLoading(true);

				const response =
					await fetchApi<UserResponseType>('/api/auth/me');

				if (
					response &&
					response.status === 'success' &&
					response.data &&
					response.data.user
				) {
					setUser(response.data.user);
				} else {
					setUser(null);

					if (response) {
						console.warn(
							'/api/auth/me response was not successful or data was malformed:',
							response
						);
					}
				}
			} catch (error) {
				if (error instanceof ApiError) {
					console.error('API Error fetching user:', error.errors);
				} else {
					console.error('Failed to fetch user:', error);
				}
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		}

		fetchCurrentSessionUser();
	}, []);

	const login = (loggedInUser: UserProfile) => {
		setUser(loggedInUser);
	};

	const logout = async () => {
		try {
			await fetchApi('/api/auth/logout', { method: 'POST' });
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('API Error during logout:', error.errors);
			} else {
				console.error('Logout API call failed:', error);
			}
		} finally {
			setUser(null);
		}
	};

	const isAuthenticated = !!user;

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, isLoading, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
