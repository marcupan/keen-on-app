import { z } from 'zod';

import {
	CreateCardValidationSchema,
	GenerateCardValidationSchema,
} from '@/validations/card';

export type CardType = {
	id: string;
	word: string;
	translation: string;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type CardResponse = {
	status: 'success' | 'error' | 'fail';
	data: {
		card: CardType;
	};
}

export type CardsResponseType = {
	status: 'success' | 'error' | 'fail';
	data: {
		cards: CardType[];
	};
	meta: {
		skip: number;
		take: number;
	};
};

export type GenerateCardValues = z.infer<typeof GenerateCardValidationSchema>;

export type GenerateCardResponse = {
	status: string;
	data: {
		image: string;
		translation: string;
		characterBreakdown: string[];
		exampleSentences: string[];
	};
};

export type GeneratedData = {
	image: string;
	translation: string;
	characterBreakdown: string[];
	exampleSentences: string[];
};

export type CreateCardValues = z.infer<typeof CreateCardValidationSchema>;

export type CreateCardResponse = {
	message: string;
};

export type CardInputType<T> = {
	name: keyof T;
	label: string;
	type?: 'text' | 'file';
};

export type UpdateCardValues = {
	word: string;
	translation: string;
	image: string;
	sentence: string;
};

export type CardQueryParams = {
	folderId: string;
	cardId: string;
};

export type UpdateCardResponse = {
	message: string;
};
