import { User } from "@/src/entities/user";
import { create } from "zustand";

interface AuthState {
	user: User | null;
	token: string | null;
	signin: (user: User, token: string) => void;
	setToken: (token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	signin: (user: User, token: string) => {
		set({
			user,
			token,
		});
	},
	setToken: (token: string) => {
		set({ token });
	},
	logout: () => {
		set({ user: null, token: null });
	},
}));
