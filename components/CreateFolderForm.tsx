import { useForm } from '@tanstack/react-form';

import CreateFolderValidationSchema from '@/validations/folder';
import FieldInfo from '@/components/ui/FieldInfo';
import { type CreateFolderValues } from '@/hooks/useCreateFolder';

type CreateFolderFormProps = {
	onSubmit: (values: CreateFolderValues) => Promise<void>;
	isSubmitting: boolean;
};

type FormFieldProps = {
	name: 'name' | 'description';
	label: string;
};

export function CreateFolderForm({ onSubmit, isSubmitting }: CreateFolderFormProps) {
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

	function FormField({ name, label }: FormFieldProps) {
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
							type="text"
							value={field.state.value}
							className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FormField label="Folder Name" name="name" />
			<FormField label="Description" name="description" />

			<form.Subscribe
				selector={(state) => [state.canSubmit]}
			>
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
