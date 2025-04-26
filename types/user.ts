export interface UserProfile {
	id: string;
	name: string;
	email: string;
}

export type UserResponseType = {
	status: 'success' | 'error' | 'fail';
	data: {
		user: UserProfile;
	};
};
