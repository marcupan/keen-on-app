import { z } from 'zod';

export const GenerateCardValidationSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	imageBase64: z.string().min(1, 'Image selection is required'),
});

export const CreateCardValidationSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	translation: z.string().min(1, 'Translation is required'),
	imageUrl: z.string(),
	sentence: z.string(),
});
