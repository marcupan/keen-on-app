interface ErrorMessageProps {
	message?: string;
}

export function ErrorMessage({
	message = 'An error occurred.',
}: ErrorMessageProps) {
	return <p className="text-red-500 p-4">{message}</p>;
}
