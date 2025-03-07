'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import { z } from 'zod';

import ApiErrorValidationSchema from '@/app/validations/errors';
import LoginValidationSchema from '@/app/validations/login';
import FieldInfo from '@/app/components/FieldInfo';

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
					const parsedError = ApiErrorValidationSchema.parse(errorData);

					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {}

				throw new Error(errorMessage);
			}

			return res.json() as Promise<LoginResponse>;
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

	return (
		<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
			<h1 className="text-2xl mb-4">Login</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="email">
					{(field) => (
						<div className="mb-4">
							<label
								htmlFor={field.name}
								className="block text-sm font-medium mb-1"
							>
								Email:
							</label>
							<input
								id={field.name}
								name={field.name}
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								className="border p-2 w-full"
							/>
							<FieldInfo field={field} />
						</div>
					)}
				</form.Field>
				<form.Field name="password">
					{(field) => (
						<div className="mb-4">
							<label
								htmlFor={field.name}
								className="block text-sm font-medium mb-1"
							>
								Password:
							</label>
							<input
								id={field.name}
								name={field.name}
								type="password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								className="border p-2 w-full"
							/>
							<FieldInfo field={field} />
						</div>
					)}
				</form.Field>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
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
	);
}
