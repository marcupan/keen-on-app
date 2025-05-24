import { ApiError } from '@/lib/api-client';

interface ErrorMessageProps {
	error: Error;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
	const message =
		error instanceof ApiError
			? error.errors.join(', ')
			: error.message || 'An unexpected error occurred.';

	return (
		<div className="text-red-500 p-4" role="alert" aria-live="polite">
			{message}
		</div>
	);
}
