import { z } from 'zod';

const ApiErrorValidationSchema = z.object({
	status: z.string(),
	errors: z.array(
		z.object({
			code: z.string(),
			minimum: z.number().optional(),
			type: z.string(),
			inclusive: z.boolean().optional(),
			exact: z.boolean().optional(),
			message: z.string(),
			path: z.array(z.string()),
		})
	),
});

export default ApiErrorValidationSchema;
