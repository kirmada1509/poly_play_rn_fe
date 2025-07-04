import { User } from "@/src/entities/user";
import api from "@/src/utils/api/api-client";
import { LoginRequest, LoginResponse } from "./api-models";

export const loginAPI = async (data: LoginRequest) => {
	return api.post<LoginResponse>("/auth/login", data);
};
export const signupAPI = async (data: LoginRequest) => {
	return api.post<LoginResponse>("/auth/signup", data);
};

export const getProfileAPI = () => {
	return api.get<User>("/user/me");
};
