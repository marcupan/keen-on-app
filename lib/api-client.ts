import { config } from '@/lib/config';

/**
 * Custom error class for API-related errors.
 * It holds an array of error messages.
 */
export class ApiError extends Error {
	constructor(public errors: string[]) {
		super(errors.join(', '));
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}

/**
 * Interface for the expected CSRF token response.
 */
interface CsrfResponse {
	csrfToken: string;
}

/**
 * Interface for expected API error responses.
 */
interface ApiErrorDetail {
	message: string;
}

interface ErrorResponse {
	errors?: ApiErrorDetail[];
	message?: string;
}

/**
 * Fetches the CSRF token from the API with retry logic.
 * @returns A promise that resolves to the CSRF token string.
 * @throws {Error} If fetching fails after multiple attempts.
 */
async function getCsrfToken(): Promise<string> {
	const maxRetries = 3;
	let attempt = 0;
	let lastError: Error | null = null;

	while (attempt < maxRetries) {
		try {
			const response = await fetch(
				`${config.apiBaseUrl}/api/auth/csrf-token`,
				{
					credentials: 'include',
					headers: {
						'Cache-Control': 'no-cache, no-store, must-revalidate',
						Pragma: 'no-cache',
						Expires: '0',
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch CSRF token: ${response.status} ${response.statusText}`
				);
			}

			const data: unknown = await response.json();

			if (
				typeof data === 'object' &&
				data !== null &&
				'csrfToken' in data &&
				typeof (data as CsrfResponse).csrfToken === 'string'
			) {
				return (data as CsrfResponse).csrfToken;
			} else {
				throw new Error('CSRF token not found or invalid in response');
			}
		} catch (error) {
			lastError =
				error instanceof Error ? error : new Error(String(error));
			attempt++;
			console.error(
				`CSRF token fetch attempt ${attempt} failed:`,
				lastError.message
			);

			if (attempt < maxRetries) {
				const delay = Math.pow(2, attempt) * 500 + Math.random() * 100;
				console.log(
					`Retrying CSRF token fetch in ${delay.toFixed(0)}ms...`
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw new Error(
		`Failed to fetch CSRF token after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`
	);
}

/**
 * A generic function to make API calls.
 * Handles CSRF token fetching for non-GET/HEAD requests and provides structured error handling.
 *
 * @param endpoint - The API endpoint path (e.g., '/users').
 * @param options - Optional RequestInit options (method, headers, body, etc.).
 * @returns A promise that resolves to the API response data (type T) or null for 204 responses.
 * @throws {ApiError} For API-specific errors or network issues.
 */
export async function fetchApi<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T | null> {
	const { method = 'GET', headers = {}, ...rest } = options;

	const finalHeaders = new Headers(headers as HeadersInit);
	if (!finalHeaders.has('Content-Type')) {
		finalHeaders.set('Content-Type', 'application/json');
	}

	let csrfError: Error | null = null;

	if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
		try {
			const token = await getCsrfToken();
			finalHeaders.set('X-CSRF-Token', token);
		} catch (error) {
			csrfError =
				error instanceof Error ? error : new Error(String(error));
			console.error(
				'Failed to get CSRF token, proceeding without it:',
				csrfError.message
			);
		}
	}

	try {
		const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
			credentials: 'include',
			method,
			headers: finalHeaders,
			...rest,
		});

		if (!response.ok) {
			let errors: string[] = ['An unknown error occurred.'];

			try {
				const errorData = (await response.json()) as ErrorResponse;
				if (errorData?.errors && Array.isArray(errorData.errors)) {
					errors = errorData.errors
						.map((err) => err?.message)
						.filter((msg): msg is string => !!msg);
				} else if (errorData?.message) {
					errors = [errorData.message];
				}

				if (errors.length === 0) {
					errors = [
						`HTTP Error: ${response.status} ${response.statusText}`,
					];
				}
			} catch {
				errors = [
					`HTTP Error: ${response.status} ${response.statusText}`,
				];
			}

			if (response.status === 403 && csrfError) {
				errors.push(
					`CSRF token fetch failed: ${csrfError.message}`,
					'Please try refreshing the page.'
				);
			}

			throw new ApiError(errors);
		}

		if (response.status === 204) {
			return null;
		}

		return (await response.json()) as Promise<T>;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof TypeError && csrfError) {
			throw new ApiError([
				'Network error occurred after CSRF token fetch failed.',
				'This might indicate server issues or a connection problem.',
				'Please try again later or refresh the page.',
				`Original Error: ${error.message}`,
			]);
		}

		const message = error instanceof Error ? error.message : String(error);
		throw new ApiError([`An unexpected error occurred: ${message}`]);
	}
}
