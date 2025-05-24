import { ReactNode } from 'react';

interface SubmitButtonProps {
	isSubmitting: boolean;
	canSubmit: boolean;
	submittingText?: string;
	children: ReactNode;
}

export function SubmitButton({
	isSubmitting,
	canSubmit,
	submittingText = 'Saving...',
	children,
}: SubmitButtonProps) {
	return (
		<button
			type="submit"
			disabled={!canSubmit || isSubmitting}
			className="px-4 py-2 bg-blue-600 text-white disabled:bg-blue-400"
		>
			{isSubmitting ? submittingText : children}
		</button>
	);
}
