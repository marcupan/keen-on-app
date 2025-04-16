import { ButtonHTMLAttributes } from 'react';

import cn from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	variant?: 'primary' | 'secondary';
}

export function Button({
	children,
	isLoading,
	variant = 'primary',
	className,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				'px-4 py-2',
				{
					'bg-blue-600 text-white': variant === 'primary',
					'bg-gray-200 text-gray-800': variant === 'secondary',
					'opacity-50 cursor-not-allowed':
						isLoading || props.disabled,
				},
				className
			)}
			{...props}
		>
			{isLoading ? 'Loading...' : children}
		</button>
	);
}
