'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/app/lib/auth';

type ProtectedPageProps = {
	children: React.ReactNode;
};

export default function ProtectedPage({ children }: ProtectedPageProps) {
	const { isAuthenticated } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace('/auth/login');
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
