'use client';

import React from 'react';

import { useProfile } from '@/hooks/useProfile';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function ProfileContent() {
	const { data, isLoading, error } = useProfile();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorMessage message="Error loading profile." />;
	}

	if (!data) {
		return null;
	}

	return (
		<div>
			<h1 className="text-2xl mb-4">Profile</h1>
			<div className="space-y-2">
				<p className="mb-2">
					<span className="font-medium">Name:</span> {data.name}
				</p>
				<p className="mb-2">
					<span className="font-medium">Email:</span> {data.email}
				</p>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<ErrorBoundary>
			<Card>
				<ProfileContent />
			</Card>
		</ErrorBoundary>
	);
}
