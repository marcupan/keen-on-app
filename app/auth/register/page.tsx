'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

type RegisterFormInputs = {
	name: string;
	email: string;
	password: string;
};

export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInputs>();
	const router = useRouter();

	const mutation = useMutation(
		async (data: RegisterFormInputs) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);
			if (!res.ok) {
				throw new Error('Registration failed');
			}
			return res.json();
		},
		{
			onSuccess: () => {
				router.push('/auth/login');
			},
		}
	);

	const onSubmit = (formData: RegisterFormInputs) => {
		mutation.mutate(formData);
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
			<h1 className="text-2xl mb-4">Register</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium">
						Name
					</label>
					<input
						id="name"
						{...register('name', { required: true })}
						className="mt-1 w-full border p-2"
					/>
					{errors.name && (
						<p className="text-red-500">Name is required</p>
					)}
				</div>
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
						{...register('password', {
							required: true,
							minLength: 6,
						})}
						className="mt-1 w-full border p-2"
					/>
					{errors.password && (
						<p className="text-red-500">
							Password must be at least 6 characters
						</p>
					)}
				</div>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white"
					disabled={mutation.isLoading}
				>
					Register
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
