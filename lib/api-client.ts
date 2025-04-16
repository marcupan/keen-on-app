const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
	constructor(public errors: string[]) {
		super(errors.join(', '));
	}
}

export async function fetchApi<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${endpoint}`, {
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
			if (errorData.errors) {
				errors = errorData.errors.map(
					(err: { message: string }) => err.message
				);
			}
		} catch {
			// Use a default error message
		}

		throw new ApiError(errors);
	}

	return res.json();
}
