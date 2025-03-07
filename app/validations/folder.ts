import { z } from 'zod';

const CreateFolderValidationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string(),
});

export default CreateFolderValidationSchema;
