'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../lib/auth';

export default function ProtectedPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace('/auth/login');
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null; // or a loading spinner
	}

	return <>{children}</>;
}
