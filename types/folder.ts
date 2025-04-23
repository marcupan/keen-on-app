export type FolderQueryProps = {
	folderId: string;
};

export type FolderType = {
	name: string;
	description?: string;
};

export type FolderResponseType = {
	status: 'success' | 'error' | 'fail';
	data: {
		folder: FolderType;
	};
};

export type FoldersResponseType = {
	status: 'success' | 'error' | 'fail';
	data: {
		folders: FolderType[];
	};
	meta: {
		skip: number;
		take: number;
	};
};

export type UpdateFolderResponse = {
	message: string;
};
