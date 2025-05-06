'use client';

import * as React from 'react';

import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import { z } from 'zod';

import LoginValidationSchema from '@/validations/login';
import FieldInfo from '@/components/ui/FieldInfo';
import { useAuth } from '@/lib/auth';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api-client';

type LoginValues = z.infer<typeof LoginValidationSchema>;

type LoginResponse = {
	user: User;
};

type FormFieldsType = {
	name: 'email' | 'password';
	label: string;
	type?: 'text' | 'password';
};

export default function LoginForm() {
	const { login } = useAuth();

	const mutation = useMutation<LoginResponse, Error, LoginValues>({
		mutationFn: async (values: LoginValues) => {
			const result = await fetchApi<LoginResponse>('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			});

			if (result === null) {
				throw new Error('Login failed. Please check your credentials.');
			}

			return result;
		},
		onSuccess: (data) => {
			login(data.user);
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

	function TextInput({ name, label, type = 'text' }: FormFieldsType) {
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
							className="border p-2 w-full rounded"
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
			<div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
				<h1 className="text-2xl font-semibold mb-6 text-center">
					Login
				</h1>
				<form
					onSubmit={(ev) => {
						ev.preventDefault();
						ev.stopPropagation();
						form.handleSubmit();
					}}
				>
					<TextInput name="email" label="Email" />
					<TextInput
						name="password"
						label="Password"
						type="password"
					/>

					<form.Subscribe
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
						]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								isLoading={isSubmitting}
								className="w-full mt-4"
								variant="primary"
							>
								{isSubmitting ? 'Logging in...' : 'Login'}
							</Button>
						)}
					</form.Subscribe>
				</form>

				{mutation.isError && (
					<p className="text-red-500 mt-4 text-sm text-center">
						{(mutation.error as Error).message}
					</p>
				)}
			</div>

			<p className="mt-6 text-center text-sm">
				<Link
					href="/register"
					className="text-blue-600 hover:underline"
				>
					Register
				</Link>
			</p>
		</div>
	);
}
