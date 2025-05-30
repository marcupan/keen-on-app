'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

import { z } from 'zod';

import RegisterValidationSchema from '@/validations/register';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api-client';
import { FormInput } from '@/components/ui/FormInput';

type RegisterValues = z.infer<typeof RegisterValidationSchema>;

type RegisterResponse = {
	message: string;
};

type RegisterInputType = {
	name: 'name' | 'email' | 'password' | 'passwordConfirm';
	label: string;
	type?: 'text' | 'password';
};

export default function RegisterForm() {
	const router = useRouter();

	const mutation = useMutation<RegisterResponse, Error, RegisterValues>({
		mutationFn: async (values) => {
			const result = await fetchApi<RegisterResponse>(
				'/api/auth/register',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values),
				}
			);

			if (result === null) {
				throw new Error('Registration failed.');
			}

			return result;
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
			await mutation.mutateAsync(value);
		},
	});

	const TextInput = ({ name, label, type = 'text' }: RegisterInputType) => (
		<form.Field name={name}>
			{(field) => (
				<FormInput
					id={field.name}
					label={label}
					name={field.name}
					type={type}
					value={field.state.value}
					error={field.state.meta.errors
						.map((err) => err?.message)
						.filter(
							(message): message is string =>
								message !== undefined
						)}
					onChange={field.handleChange}
					onBlur={field.handleBlur}
				/>
			)}
		</form.Field>
	);

	return (
		<div className="max-w-md mx-auto">
			<div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
				<h1 className="text-2xl font-semibold mb-6 text-center">
					Register
				</h1>
				<form
					onSubmit={(ev) => {
						ev.preventDefault();
						ev.stopPropagation();
						form.handleSubmit();
					}}
				>
					<TextInput name="name" label="Name" />
					<TextInput name="email" label="Email" />
					<TextInput
						name="password"
						label="Password"
						type="password"
					/>
					<TextInput
						name="passwordConfirm"
						label="Confirm Password"
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
								{isSubmitting ? 'Registering...' : 'Register'}
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
				Already have an account?{' '}
				<Link href="/login" className="text-blue-600 hover:underline">
					Login
				</Link>
			</p>
		</div>
	);
}
