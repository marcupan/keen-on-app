export type UserType = {
	id: string;
	name: string;
	email: string;
};

export type UserResponseType = {
	status: 'success' | 'error' | 'fail';
	data: {
		user: UserType;
	};
};
