import * as React from 'react';

import type { AnyFieldApi } from '@tanstack/react-form';

type FieldInfoProps = {
	field: AnyFieldApi
};

const FieldInfo = ({ field }: FieldInfoProps) => (
	<>
		{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
			<em className="text-red-500">
				{field.state.meta.errors.map((err) => err.message).join(', ')}
			</em>
		)}
		{field.state.meta.isValidating && 'Validating...'}
	</>
);

export default FieldInfo;
