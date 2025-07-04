import { User } from "@/src/entities/user";
import { create } from "zustand";

interface AuthState {
	user: User | null;
	token: string | null;
	login: (user: User, token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	login: (user: User, token: string) => {
		set({
			user,
			token,
		});
	},
	logout: () => {
		set({ user: null, token: null });
	},
}));
