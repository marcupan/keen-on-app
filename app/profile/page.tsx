'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../lib/auth';

interface UserProfile {
	id: string;
	name: string;
	email: string;
}

export default function ProfilePage() {
	const { isAuthenticated } = useAuth();

	// Example: fetch user profile from external API
	const { data, isLoading, error } = useQuery<UserProfile>(
		['profile'],
		async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			if (!res.ok) {
				throw new Error('Error fetching profile');
			}
			return res.json();
		},
		{ enabled: isAuthenticated }
	);

	if (isLoading) return <p>Loading profile...</p>;
	if (error) return <p className="text-red-500">Error loading profile.</p>;

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow mt-4">
			<h1 className="text-2xl mb-4">Profile</h1>
			{data && (
				<div>
					<p className="mb-2">Name: {data.name}</p>
					<p className="mb-2">Email: {data.email}</p>
				</div>
			)}
		</div>
	);
}
