import { z } from 'zod';

const RegisterValidationSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(8, 'Password must be more than 8 characters')
			.max(32, 'Password must be less than 32 characters'),
		passwordConfirm: z
			.string()
			.min(8, 'Password must be more than 8 characters')
			.max(32, 'Password must be less than 32 characters'),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm'],
	});

export default RegisterValidationSchema;
