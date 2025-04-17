import Link from 'next/link';

import { FolderType } from '@/types/folder';

type FolderItemProps = {
	folder: FolderType;
};

export const FolderItem = ({ folder }: FolderItemProps) => {
	return (
		<div className="p-2 bg-white shadow">
			<Link
				href={`/folders/${folder.id}`}
				className="font-semibold underline"
			>
				{folder.name}
			</Link>
			{folder.description && (
				<p className="text-sm">{folder.description}</p>
			)}
		</div>
	);
};
