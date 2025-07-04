// src/services/auth-service.ts
import { LoginRequest } from "./api-models";
import { loginAPI, getProfileAPI } from "./auth-api";
import { useAuthStore } from "./auth-store";

const authStore = useAuthStore.getState();

export const loginService = async (req: LoginRequest) => {
	try {
		const { access_token } = await loginAPI(req);
		const user = await getProfileAPI();
        authStore.login(user, access_token);
	} catch (err: any) {
		console.error("Login failed:", err.message || err);
		throw err;
	}
};
