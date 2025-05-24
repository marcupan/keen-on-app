import { ReactNode } from 'react';

import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface AsyncStateWrapperProps {
	isLoading: boolean;
	error?: Error | null;
	children: ReactNode;
	loadingMessage?: string;
}

export function AsyncStateWrapper({
	isLoading,
	error,
	children,
	loadingMessage,
}: AsyncStateWrapperProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center">
				<LoadingSpinner />
				{loadingMessage && <p className="mt-2">{loadingMessage}</p>}
			</div>
		);
	}

	if (error) {
		return <ErrorMessage error={error} />;
	}

	return <>{children}</>;
}
