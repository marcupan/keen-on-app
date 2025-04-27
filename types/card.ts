export type CardType = {
	id: string;
	word: string;
	translation: string;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
};

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
