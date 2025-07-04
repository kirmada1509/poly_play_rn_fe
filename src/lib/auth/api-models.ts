export interface signinRequest {
	email: string;
	password: string;
}

export interface signinResponse {
	access_token: string;
}

export interface ProfileResponse {
	uid: string;
	email: string;
	username: string;
}
