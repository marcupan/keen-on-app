'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched &&
				field.state.meta.errors.length > 0 && (
					<em className="text-red-500">
						{field.state.meta.errors
							.map((err) => err.message)
							.join(', ')}
					</em>
				)}
			{field.state.meta.isValidating && 'Validating...'}
		</>
	);
}

const LoginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof LoginSchema>;

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

					console.log(errorData);

					errorMessage = errorData.message || errorMessage;
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
		defaultValues: { email: '', password: '' },
		validators: { onChange: LoginSchema },
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
