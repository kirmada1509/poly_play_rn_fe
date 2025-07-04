// src/services/auth-service.ts
import { signinRequest } from "./api-models";
import { GetProfileAPI, SigninAPI } from "./auth-api";
import { useAuthStore } from "./auth-store";

const authStore = useAuthStore.getState();

export const signinService = async (req: signinRequest) => {
	try {
		const { access_token } = await SigninAPI(req);
		
		// Store token first so it's available for subsequent API calls
		authStore.setToken(access_token);
		
		try {
			// Now fetch user profile with the token in place
			const user = await GetProfileAPI();
			
			// Complete the signin process with user data
			authStore.signin(user, access_token);
		} catch (profileError) {
			console.warn("Failed to fetch user profile, but login was successful:", profileError);
			// For now, create a minimal user object since we have the token
			const minimalUser = { 
				id: "unknown", 
				email: req.email, 
				username: req.email.split('@')[0] 
			};
			authStore.signin(minimalUser, access_token);
		}
	} catch (err: any) {
		console.error("signin failed:", err.message || err);
		throw err;
	}
};
