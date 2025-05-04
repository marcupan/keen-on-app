'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { fetchApi } from '@/lib/api-client';

type QueryParamsType = {
	verificationCode: string;
};

export default function VerifyEmailPage() {
	const { verificationCode } = useParams<QueryParamsType>();

	const { isLoading, error, isSuccess } = useQuery({
		queryKey: ['verifyEmail', verificationCode],
		queryFn: async () => {
			if (!verificationCode) {
				throw new Error('Verification code is missing.');
			}

			const result = await fetchApi(
				`/api/auth/verifyemail/${verificationCode}`
			);

			if (result === null) {
				throw new Error('Verification failed.');
			}

			return result;
		},
		enabled: !!verificationCode,
		retry: false,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p>Verifying your email...</p>
			</div>
		);
	}

	return (
		<ErrorBoundary
			fallback={
				<div className="max-w-md mx-auto p-4 bg-white shadow mt-4 text-red-500">
					An unexpected error occurred. Please try again later.
				</div>
			}
		>
			<div className="max-w-md mx-auto mt-10">
				{error ? (
					<div className="p-4 bg-red-100 text-red-700 border border-red-300 shadow">
						<h1 className="text-2xl mb-2">Verification Failed</h1>
						<p>
							Error verifying email:{' '}
							{(error as Error).message ||
								'An unknown error occurred.'}
						</p>
						<p className="mt-4">
							Please check the link or request a new verification
							email.
						</p>
					</div>
				) : isSuccess ? (
					<div className="p-4 bg-green-100 text-green-700 border border-green-300 shadow">
						<h1 className="text-2xl mb-2">Email Verified</h1>
						<p>Your email has been successfully verified.</p>
						<p className="mt-6 text-center">
							<Link
								href="/"
								className="text-blue-600 hover:underline"
							>
								Go to Dashboard
							</Link>
						</p>
					</div>
				) : (
					<div className="p-4 bg-yellow-100 text-yellow-700 border border-yellow-300 shadow">
						<h1 className="text-2xl mb-2">Missing Code</h1>
						<p>
							No verification code found in the URL. Please use
							the link provided in your email.
						</p>
					</div>
				)}
			</div>
		</ErrorBoundary>
	);
}
