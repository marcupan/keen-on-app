'use client';

import React, { ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/auth';

type ProtectedPageProps = {
	children: ReactNode;
};

export default function ProtectedPage({ children }: ProtectedPageProps) {
	const { isAuthenticated, isLoading } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/login');
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
