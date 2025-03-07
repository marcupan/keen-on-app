import { z } from 'zod';

const CreateCardValidationSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	translation: z.string().min(1, 'Translation is required'),
	imageUrl: z.string(),
	sentence: z.string(),
});

export default CreateCardValidationSchema;
