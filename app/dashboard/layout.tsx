'use client';

import React from 'react';

import ProtectedPage from '@/components/ProtectedPage';
import Header from '@/components/Header';

type ProtectedPageProps = {
	children: React.ReactNode;
};

const DashboardLayout = ({ children }: ProtectedPageProps) => (
	<ProtectedPage>
		<Header />

		<main className="p-4">{children}</main>
	</ProtectedPage>
);

export default DashboardLayout;
