import React from 'react';

type FieldErrorProps = {
	id: string;
	errors: string[];
};

export const FieldError = ({ id, errors }: FieldErrorProps) => (
	<div id={id} className="text-red-600 text-sm mt-1">
		{errors.join(', ')}
	</div>
);

type FormLabelProps = {
	htmlFor: string;
	children: React.ReactNode;
};

export const FormLabel = ({ htmlFor, children }: FormLabelProps) => (
	<label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
		{children}
	</label>
);
