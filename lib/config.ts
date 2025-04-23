import { z } from 'zod';

const configSchema = z.object({
	apiBaseUrl: z.string().url({ message: 'Invalid API Base URL' }),
});

export type AppConfig = z.infer<typeof configSchema>;

function validateConfig(rawConfig: unknown): AppConfig {
	try {
		const validatedConfig = configSchema.parse(rawConfig);

		return Object.freeze(validatedConfig);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error(
				'Invalid application configuration:',
				error.flatten().fieldErrors
			);

			throw new Error('Application configuration validation failed.');
		}

		throw error;
	}
}

const rawConfig = {
	apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
};

export const config: AppConfig = validateConfig(rawConfig);
