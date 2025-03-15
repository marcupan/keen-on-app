'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { router } from 'next/client';

interface User {
	name: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (storedToken) {
			setToken(storedToken);
		}

		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const login = (newToken: string) => {
		setToken(newToken);
		localStorage.setItem('token', newToken);

		const dummyUser = { name: 'John Doe', email: 'john@example.com' };

		setUser(dummyUser);
		localStorage.setItem('user', JSON.stringify(dummyUser));
	};

	const logout = () => {
		setToken(null);
		setUser(null);

		localStorage.removeItem('token');
		localStorage.removeItem('user');

		router.push('/auth/login');
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!token,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
