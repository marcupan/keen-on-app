'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useField } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/app/lib/auth';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();

	const mutation = useMutation(
		async (data: { email: string; password: string }) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);
			if (!res.ok) throw new Error('Login failed');
			return res.json();
		}
	);

	const {
		Form,
		meta: { canSubmit, isSubmitting },
	} = useForm({
		onSubmit: async (values) => {
			const result = await mutation.mutateAsync(values);
			if (result.access_token) {
				login(result.access_token);
				router.push('/dashboard');
			}
		},
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Simple text input component using useField()
	function TextInput({ label, name }: { label: string; name: string }) {
		const { getInputProps, getMeta } = useField(name);
		const meta = getMeta();
		return (
			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">
					{label}
				</label>
				<input
					{...getInputProps({ type: 'text' })}
					className="border p-2 w-full"
				/>
				{meta.error && <p className="text-red-500">{meta.error}</p>}
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
			<h1 className="text-2xl mb-4">Login</h1>
			<Form>
				<TextInput label="Email" name="email" />
				<TextInput label="Password" name="password" />
				{mutation.isError && (
					<p className="text-red-500 mb-2">
						{(mutation.error as Error).message}
					</p>
				)}
				<button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white"
				>
					{isSubmitting ? 'Logging in...' : 'Login'}
				</button>
			</Form>
		</div>
	);
}
