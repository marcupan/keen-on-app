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
	const res = await fetch(`${config.apiBaseUrl}${endpoint}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (!res.ok) {
		let errors = ['An error occurred'];

		try {
			const errorData = await res.json();

			if (errorData && Array.isArray(errorData.errors)) {
				errors = errorData.errors.map(
					(err: { message: string }) =>
						err.message || 'Unknown error detail'
				);
			} else if (errorData && errorData.message) {
				errors = [errorData.message];
			}
		} catch {
			errors = [`HTTP Error: ${res.status} ${res.statusText}`];
		}

		throw new ApiError(errors);
	}

	if (res.status === 204) {
		return null;
	}

	return res.json();
}
