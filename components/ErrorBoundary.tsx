import React from 'react';

interface Props {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
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
