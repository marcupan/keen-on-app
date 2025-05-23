import { ChangeEvent, InputHTMLAttributes } from 'react';
import classNames from 'classnames';

import { FormLabel, FieldError } from './FormField';

type BaseInputProps = {
	id: string;
	name: string;
	value?: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	error?: string[];
	className?: string;
};

type FormInputProps = BaseInputProps & {
	label: string;
	type?: 'text' | 'file' | 'password';
	accept?: string;
	placeholder?: string;
};

export function FormInput({
	label,
	id,
	name,
	value,
	onChange,
	onBlur,
	type = 'text',
	error,
	accept,
	className,
	placeholder,
}: FormInputProps) {
	const hasErrors = !!error && error.length > 0;

	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		if (type === 'file') {
			const file = ev.target.files?.[0];

			if (file) {
				const reader = new FileReader();

				reader.onload = () => {
					onChange(reader.result as string);
				};
				reader.onerror = () => {
					console.error('Error reading file');
					onChange('');
				};
				reader.readAsDataURL(file);
			} else {
				onChange('');
			}
		} else {
			onChange(ev.target.value);
		}
	};

	const inputProps: InputHTMLAttributes<HTMLInputElement> = {
		id,
		name,
		type,
		value: type === 'file' ? undefined : value,
		onChange: handleChange,
		onBlur,
		accept: type === 'file' ? accept || 'image/*' : undefined,
		placeholder,
		className: classNames(
			'w-full rounded shadow-sm p-2 border',
			{
				'file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100':
					type === 'file',
			},
			className
		),
		'aria-invalid': hasErrors,
		'aria-describedby': hasErrors ? `${id}-error` : undefined,
	};

	return (
		<div className="mb-4">
			<FormLabel htmlFor={id}>{label}</FormLabel>

			<input
				{...inputProps}
				type={type}
				accept={type === 'file' ? accept || 'image/*' : undefined}
				placeholder={placeholder}
			/>

			{error && error.length > 0 && (
				<FieldError id={`${id}-error`} errors={error} />
			)}

			{type === 'file' && value && (
				<div className="mt-2 border rounded overflow-hidden max-w-[200px]">
					<img
						src={value}
						alt="Preview"
						className="w-full h-auto object-contain"
					/>
				</div>
			)}
		</div>
	);
}
