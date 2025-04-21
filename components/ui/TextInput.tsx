import React from 'react';

type TextInputProps = {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	onBlur: () => void;
};

export default function TextInput({
	label,
	name,
	value,
	onChange,
	onBlur,
}: TextInputProps) {
	return (
		<div className="mb-4">
			<label htmlFor={name} className="block text-sm font-medium mb-1">
				{label}
			</label>
			<input
				id={name}
				name={name}
				type="text"
				value={value}
				className="border p-2 w-full"
				onBlur={onBlur}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
