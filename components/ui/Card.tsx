import { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string;
}

export function Card({ children, className = '' }: CardProps) {
	return (
		<div
			className={`max-w-md mx-auto p-4 bg-white shadow mt-4 ${className}`}
		>
			{children}
		</div>
	);
}
