'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import { z } from 'zod';

import RegisterValidationSchema from '@/validations/register';
import ApiErrorValidationSchema from '@/validations/errors';
import FieldInfo from '@/components/FieldInfo';

type RegisterValues = z.infer<typeof RegisterValidationSchema>;

type RegisterResponse = {
	message: string;
};

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
		onSuccess: () => {
			router.push('/login');
		},
	});

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordConfirm: '',
		},
		validators: {
			onChange: RegisterValidationSchema,
		},
		onSubmit: async ({ value }) => {
			console.log('value: ', value);

			await mutation.mutateAsync(value);
		},
	});

	function TextInput({
		name,
		label,
		type = 'text',
	}: {
		name: 'name' | 'email' | 'password' | 'passwordConfirm';
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
							className="border p-2 w-full"
							value={field.state.value}
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
		<div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
			<h1 className="text-2xl mb-4">Register</h1>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();

					form.handleSubmit();
				}}
			>
				<TextInput name="name" label="Name" />
				<TextInput name="email" label="Email" />
				<TextInput name="password" label="Password" type="password" />
				<TextInput name="passwordConfirm" label="Confirm Password" type="password" />

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
