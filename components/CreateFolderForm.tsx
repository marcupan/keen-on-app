import { useForm } from '@tanstack/react-form';

import CreateFolderValidationSchema from '@/validations/folder';
import { CreateFolderValues } from '@/types/folder';
import { FormInput } from '@/components/ui/FormInput';
import React from 'react';

type CreateFolderFormProps = {
	onSubmit: (values: CreateFolderValues) => Promise<void>;
	isSubmitting: boolean;
};

type FormFieldProps = {
	name: 'name' | 'description';
	label: string;
};

export function CreateFolderForm({
	onSubmit,
	isSubmitting,
}: CreateFolderFormProps) {
	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
		},
		validators: {
			onChange: CreateFolderValidationSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	const TextInput = ({ name, label }: FormFieldProps) => (
		<form.Field name={name}>
			{(field) => (
				<FormInput
					id={field.name}
					label={label}
					name={field.name}
					type="text"
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
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<TextInput label="Folder Name" name="name" />
			<TextInput label="Description" name="description" />

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<button
						type="submit"
						disabled={!canSubmit || isSubmitting}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Creating...' : 'Create'}
					</button>
				)}
			</form.Subscribe>
		</form>
	);
}
