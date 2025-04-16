const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;

export const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL,
} as const;

export function validateConfig() {
	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
			throw new Error(`Missing required environment variable: ${envVar}`);
		}
	}
}
