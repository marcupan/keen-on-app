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

const RegisterSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterValues = z.infer<typeof RegisterSchema>;

type RegisterResponse = {
	message: string;
};

const BackendErrorSchema = z.object({
	status: z.string(),
	errors: z.array(
		z.object({
			code: z.string(),
			minimum: z.number().optional(),
			type: z.string(),
			inclusive: z.boolean().optional(),
			exact: z.boolean().optional(),
			message: z.string(),
			path: z.array(z.string()),
		})
	),
});

export default function RegisterForm() {
	const router = useRouter();

	const mutation = useMutation<RegisterResponse, Error, RegisterValues>({
		mutationFn: async (values) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values),
				}
			);

			if (!res.ok) {
				let errorMessage = 'Registration failed';

				try {
					const errorData = await res.json();
					const parsedError = BackendErrorSchema.parse(errorData);
					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {}

				throw new Error(errorMessage);
			}

			return res.json() as Promise<RegisterResponse>;
		},
		onSuccess: () => {
			router.push('/auth/login');
		},
	});

	const form = useForm({
		defaultValues: { name: '', email: '', password: '' },
		validators: { onChange: RegisterSchema },
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
		},
	});

	return (
		<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
			<h1 className="text-2xl mb-4">Register</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="name">
					{(field) => (
						<div className="mb-4">
							<label
								htmlFor={field.name}
								className="block text-sm font-medium mb-1"
							>
								Name:
							</label>
							<input
								id={field.name}
								name={field.name}
								type="text"
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
							{isSubmitting ? 'Registering...' : 'Register'}
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
