'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

type QueryParamsType = {
	verificationCode: string;
};

export default function VerifyEmailPage() {
	const { verificationCode } = useParams<QueryParamsType>();

	const { isLoading, error } = useQuery({
		queryKey: ['verifyEmail', verificationCode],
		queryFn: async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verifyemail/${verificationCode}`
			);

			if (!res.ok) {
				throw new Error('Failed to verify email');
			}

			return res.json();
		},
		enabled: !!verificationCode,
	});

	if (isLoading) {
		return <p>Verifying email...</p>;
	}

	if (error) {
		return (
			<p className="text-red-500">
				Error verifying email: {(error as Error).message}
			</p>
		);
	}

	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow mt-4">
			<h1 className="text-2xl mb-4">Email Verified</h1>
			<p>Your email has been successfully verified.</p>
		</div>
	);
}
