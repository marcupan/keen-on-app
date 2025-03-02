'use client';

import React from 'react';

import ProtectedPage from '@/app/components/ProtectedPage';
import Header from '@/app/components/Header';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Wrap with ProtectedPage to ensure all nested routes require auth
	return (
		<ProtectedPage>
			<Header />
			<main className="p-4">{children}</main>
		</ProtectedPage>
	);
}
