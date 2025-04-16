export interface UserProfile {
	id: string;
	name: string;
	email: string;
}

export interface CreateCardValues {
	word: string;
	translation: string;
	imageUrl: string;
	sentence: string;
}

export interface CreateCardResponse {
	message: string;
}

export interface ApiErrorResponse {
	errors: Array<{ message: string }>;
}
