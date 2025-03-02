'use client';

import React from 'react';
import Link from 'next/link';

import { useAuth } from '../lib/auth';

export default function Header() {
	const { user, logout } = useAuth();

	return (
		<header className="flex items-center justify-between bg-white px-4 py-2 shadow">
			<div>
				<Link href="/dashboard" className="font-semibold text-lg">
					Dashboard
				</Link>
			</div>
			<div className="flex items-center space-x-4">
				{user && <span className="text-sm">Hello, {user.name}</span>}
				<Link href="/profile" className="text-sm underline">
					Profile
				</Link>
				<button
					onClick={logout}
					className="text-sm text-red-600 underline"
				>
					Logout
				</button>
			</div>
		</header>
	);
}
