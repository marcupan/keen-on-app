import { config } from '@/lib/config';

/**
 * Custom error class for API-related errors.
 * It holds an array of error messages.
 */
export class ApiError extends Error {
	constructor(public errors: string[]) {
		super(errors.join(', '));
		// Set the prototype explicitly to ensure 'instanceof' works correctly.
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
						// Cache-busting headers to ensure a fresh token
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

			// Use 'unknown' and type guards/assertions for safer JSON parsing
			const data: unknown = await response.json();

			// Type check to ensure we received a valid CSRF token.
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
				// Exponential backoff with a small jitter to avoid thundering herd
				const delay = Math.pow(2, attempt) * 500 + Math.random() * 100;
				console.log(
					`Retrying CSRF token fetch in ${delay.toFixed(0)}ms...`
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	// Throw a more informative error if all retries fail.
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

	// Build headers, setting Content-Type only if not provided.
	const finalHeaders = new Headers(headers as HeadersInit);
	if (!finalHeaders.has('Content-Type')) {
		finalHeaders.set('Content-Type', 'application/json');
	}

	let csrfError: Error | null = null;

	// Fetch and include CSRF token for mutating requests.
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
			// We proceed, but the server will likely reject, which we handle below.
		}
	}

	try {
		const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
			credentials: 'include',
			method,
			headers: finalHeaders,
			...rest,
		});

		// Handle unsuccessful responses.
		if (!response.ok) {
			let errors: string[] = ['An unknown error occurred.'];

			try {
				// Attempt to parse a structured error response.
				const errorData = (await response.json()) as ErrorResponse;
				if (errorData?.errors && Array.isArray(errorData.errors)) {
					errors = errorData.errors
						.map((err) => err?.message)
						.filter((msg): msg is string => !!msg); // Filter out empty/null messages
				} else if (errorData?.message) {
					errors = [errorData.message];
				}
				// If parsing fails or yields no messages, use the HTTP status.
				if (errors.length === 0) {
					errors = [
						`HTTP Error: ${response.status} ${response.statusText}`,
					];
				}
			} catch {
				// If parsing JSON fails, use the basic HTTP error.
				errors = [
					`HTTP Error: ${response.status} ${response.statusText}`,
				];
			}

			// Add CSRF context if relevant (403 Forbidden).
			if (response.status === 403 && csrfError) {
				errors.push(
					`CSRF token fetch failed: ${csrfError.message}`,
					'Please try refreshing the page.'
				);
			}

			throw new ApiError(errors);
		}

		// Handle 204 No Content - return null as there's nobody.
		if (response.status === 204) {
			return null;
		}

		// Return parsed JSON for successful responses (2xx).
		// We cast to T, relying on the caller to provide the correct type.
		return (await response.json()) as Promise<T>;
	} catch (error) {
		// Re-throw ApiError instances directly.
		if (error instanceof ApiError) {
			throw error;
		}

		// Provide a specific error for network issues after CSRF failure.
		if (error instanceof TypeError && csrfError) {
			throw new ApiError([
				'Network error occurred after CSRF token fetch failed.',
				'This might indicate server issues or a connection problem.',
				'Please try again later or refresh the page.',
				`Original Error: ${error.message}`,
			]);
		}

		// Wrap any other unexpected errors in ApiError for consistency.
		const message = error instanceof Error ? error.message : String(error);
		throw new ApiError([`An unexpected error occurred: ${message}`]);
	}
}
