'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { AuthContextType, User } from './types';

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const router = useRouter();

	useEffect(() => {
		const storedUser = localStorage.getItem('user');

		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const login = (currentUser: User) => {
		setUser(currentUser);

		localStorage.setItem('user', JSON.stringify(currentUser));

		router.push('/dashboard');
	};

	const logout = () => {
		setUser(null);

		localStorage.removeItem('user');

		router.push('/login');
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
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
