import { z } from 'zod';

export type FolderType = {
	id: string;
	name: string;
	description?: string;
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

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export type CreateFolderResponse = {
	status: 'success' | 'error';
	data: {
		folder: FolderType;
	};
};
