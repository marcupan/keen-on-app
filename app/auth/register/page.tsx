'use client';

import React from 'react';
import { useForm, useField } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const router = useRouter();

	const mutation = useMutation(
		async (data: { name: string; email: string; password: string }) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);
			if (!res.ok) throw new Error('Registration failed');
			return res.json();
		}
	);

	const {
		Form,
		meta: { canSubmit, isSubmitting },
	} = useForm({
		onSubmit: async (values) => {
			await mutation.mutateAsync(values);
			router.push('/auth/login');
		},
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

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
			<h1 className="text-2xl mb-4">Register</h1>
			<Form>
				<TextInput label="Name" name="name" />
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
					{isSubmitting ? 'Registering...' : 'Register'}
				</button>
			</Form>
		</div>
	);
}
