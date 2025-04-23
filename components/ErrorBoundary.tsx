import React from 'react';

interface Props {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false, error: null };

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="text-red-500 p-4">
						Something went wrong. Please try again later.
					</div>
				)
			);
		}

		return this.props.children;
	}
}
