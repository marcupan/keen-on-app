'use client';

import React, { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/lib/auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

const fallbackEl = (
	<div
		className="p-5 text-center border border-red-200 rounded-lg bg-red-50"
		role="alert"
	>
		<h2 className="text-xl font-semibold text-red-700 mb-2">
			Application Error
		</h2>
		<p className="text-gray-700">
			Sorry, an unexpected error occurred. Please try refreshing the page.
			If the problem persists, please contact support.
		</p>
	</div>
);

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary fallback={fallbackEl}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>{children}</AuthProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	);
}
