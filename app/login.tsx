// src/screens/LoginScreen.tsx

import { loginService } from "@/src/lib/auth/auth-service";
import { showToast } from "@/src/utils/toast/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
	const {setValue, handleSubmit, formState } = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const { errors } = formState;


	const onSubmit = async (data: LoginForm) => {
		try {
			await loginService(data);
			showToast.success("Logged in successfully");
		} catch (err: any) {
			showToast.error(err.message || "Login failed");
		}
	};

	return (
		<View className="flex-1 justify-center px-6 bg-white">
			<Text className="text-2xl font-bold mb-6 text-center">Login</Text>

			<TextInput
				placeholder="Email"
				className="border p-3 rounded-lg mb-2"
				autoCapitalize="none"
				keyboardType="email-address"
				onChangeText={(text) => setValue("email", text)}
			/>
			{errors.email && (
				<Text className="text-red-500">{errors.email.message}</Text>
			)}

			<TextInput
				placeholder="Password"
				className="border p-3 rounded-lg mt-4 mb-2"
				secureTextEntry
				onChangeText={(text) => setValue("password", text)}
			/>
			{errors.password && (
				<Text className="text-red-500">{errors.password.message}</Text>
			)}

			<Pressable
				className="bg-blue-500 py-3 mt-6 rounded-lg"
				onPress={handleSubmit(onSubmit)}
			>
				<Text className="text-white text-center font-semibold">
					Login
				</Text>
			</Pressable>
		</View>
	);
}
