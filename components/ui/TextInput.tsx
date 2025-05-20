import React from 'react';

type TextInputProps = {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	onBlur: () => void;
	type?: 'text' | 'file';
};

export default function TextInput({
	label,
	name,
	value,
	onChange,
	onBlur,
	type = 'text',
}: TextInputProps) {
	if (type === 'file') {
		return (
			<div className="mb-4">
				<label
					htmlFor={name}
					className="block text-sm font-medium mb-1"
				>
					{label}
				</label>
				<input
					id={name}
					name={name}
					type="file"
					accept="image/*"
					className="border p-2 w-full"
					onBlur={onBlur}
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) {
							const reader = new FileReader();
							reader.onload = () => {
								onChange(reader.result as string);
							};
							reader.readAsDataURL(file);
						}
					}}
				/>
				{value && (
					<img
						src={value}
						alt="Preview"
						className="mt-2 max-w-[200px] h-auto"
					/>
				)}
			</div>
		);
	}

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
