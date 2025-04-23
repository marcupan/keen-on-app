import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

import { User } from './types';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (user: User) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				setIsLoading(true);
				const res = await fetch('/api/auth/me', {
					credentials: 'include',
				});

				if (!res.ok) {
					setUser(null);
				} else {
					const data = await res.json();

					setUser(data.user);
				}
			} catch {
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUser();
	}, []);

	const login = (user: User) => {
		setUser(user);
	};

	const logout = () => {
		fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		}).finally(() => setUser(null));
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
