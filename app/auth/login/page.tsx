'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/lib/auth';


type LoginFormInputs = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();
	const router = useRouter();
	const { login } = useAuth();

	const mutation = useMutation(
		async (data: LoginFormInputs) => {
			// Example call to external Node API
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);
			if (!res.ok) {
				throw new Error('Login failed');
			}
			return res.json();
		},
		{
			onSuccess: (data) => {
				// Assume data.access_token is returned
				login(data.access_token);
				router.push('/dashboard');
			},
		}
	);

	const onSubmit = (formData: LoginFormInputs) => {
		mutation.mutate(formData);
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
			<h1 className="text-2xl mb-4">Login</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						{...register('email', { required: true })}
						className="mt-1 w-full border p-2"
					/>
					{errors.email && (
						<p className="text-red-500">Email is required</p>
					)}
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						{...register('password', { required: true })}
						className="mt-1 w-full border p-2"
					/>
					{errors.password && (
						<p className="text-red-500">Password is required</p>
					)}
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white"
					disabled={mutation.isLoading}
				>
					Login
				</button>
				{mutation.error && (
					<p className="text-red-500 mt-2">
						{(mutation.error as Error).message}
					</p>
				)}
			</form>
		</div>
	);
}
