import { config } from '@/lib/config';

export class ApiError extends Error {
	constructor(public errors: string[]) {
		super(errors.join(', '));
	}
}

export async function fetchApi<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T | null> {
	const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (!response.ok) {
		let errors = ['An error occurred'];

		try {
			const errorData = await response.json();

			if (errorData && Array.isArray(errorData.errors)) {
				errors = errorData.errors.map(
					(err: { message: string }) =>
						err.message || 'Unknown error detail'
				);
			} else if (errorData && errorData.message) {
				errors = [errorData.message];
			}
		} catch {
			errors = [`HTTP Error: ${response.status} ${response.statusText}`];
		}

		throw new ApiError(errors);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}
