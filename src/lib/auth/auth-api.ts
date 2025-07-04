import { User } from "@/src/entities/user";
import api from "@/src/utils/api/api-client";
import { signinRequest, signinResponse } from "./api-models";

export const SigninAPI = async (data: signinRequest) => {
	return api.post<signinResponse>("/auth/login", data);
};
export const SignupAPI = async (data: signinRequest) => {
	return api.post<signinResponse>("/auth/signup", data);
};

export const GetProfileAPI = () => {
	return api.get<User>("/auth/me");
};
