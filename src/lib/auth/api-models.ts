export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
}

export interface ProfileResponse {
	uid: string;
	email: string;
	username: string;
}
