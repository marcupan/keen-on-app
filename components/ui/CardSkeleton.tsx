export function CardSkeleton() {
	return (
		<div className="max-w-md mx-auto p-4 bg-white shadow animate-pulse">
			<div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
			<div className="space-y-3">
				<div className="h-4 bg-gray-200 rounded" />
				<div className="h-4 bg-gray-200 rounded" />
				<div className="h-4 bg-gray-200 rounded" />
			</div>
		</div>
	);
}
