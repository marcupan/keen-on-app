'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import { z } from 'zod';

import ApiErrorValidationSchema from '@/validations/errors';
import LoginValidationSchema from '@/validations/login';
import FieldInfo from '@/components/FieldInfo';

type LoginValues = z.infer<typeof LoginValidationSchema>;

type LoginResponse = {
	access_token: string;
};

export default function LoginForm() {
	const router = useRouter();

	const mutation = useMutation<LoginResponse, Error, LoginValues>({
		mutationFn: async (values: LoginValues) => {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				let errorMessage = 'Login failed';

				try {
					const errorData = await res.json();

					const parsedError =
						ApiErrorValidationSchema.parse(errorData);

					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {}

				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: (data) => {
			console.log('Login successful, token:', data.access_token);

			router.push('/dashboard');
		},
	});

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onChange: LoginValidationSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
		},
	});

	function TextInput({
		name,
		label,
		type = 'text',
	}: {
		name: 'email' | 'password';
		label: string;
		type?: 'text' | 'password';
	}) {
		return (
			<form.Field name={name}>
				{(field) => (
					<div className="mb-4">
						<label
							htmlFor={field.name}
							className="block text-sm font-medium mb-1"
						>
							{label}
						</label>
						<input
							id={field.name}
							name={field.name}
							type={type}
							value={field.state.value}
							className="border p-2 w-full"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						<FieldInfo field={field} />
					</div>
				)}
			</form.Field>
		);
	}

	return (
		<div className="max-w-md mx-auto">
			<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
				<h1 className="text-2xl mb-4">Login</h1>
				<form
					onSubmit={(ev) => {
						ev.preventDefault();
						ev.stopPropagation();

						form.handleSubmit();
					}}
				>
					<TextInput name="email" label="Email" />
					<TextInput name="password" label="Password" type="password" />

					<form.Subscribe
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
						]}
					>
						{([canSubmit, isSubmitting]) => (
							<button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="mt-4 px-4 py-2 bg-blue-600 text-white"
							>
								{isSubmitting ? 'Logging in...' : 'Login'}
							</button>
						)}
					</form.Subscribe>
				</form>

				{mutation.isError && (
					<p className="text-red-500 mt-2">
						{(mutation.error as Error).message}
					</p>
				)}
			</div>

			<p className="mt-10 text-center text-blue-500">
				<Link href="/register">Register</Link>
			</p>
		</div>
	);
}
