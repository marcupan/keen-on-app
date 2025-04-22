import { z } from 'zod';

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

export const createFolderSchema = z.object({
	name: z.string().min(1, 'Folder name is required'),
	description: z.string().optional(),
});

export type UpdateFolderResponse = {
	message: string;
};
