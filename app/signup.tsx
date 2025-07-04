import { showToast } from "@/src/utils/toast/toast";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignupScreen() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const onSubmit = async () => {
		try {
			// TODO: Implement signup service
			console.log("Signup data:", { username, email, password, confirmPassword });
			showToast.success("Account created successfully");
			router.push("/");
		} catch (err: any) {
			showToast.error(err.message || "Signup failed");
		}
	};

	return (
		<View className="flex-1 justify-center px-6 bg-gray-50">
			<View className="w-full max-w-sm mx-auto">
				<Text className="text-2xl font-bold mb-8 text-center text-gray-800">
					Create Account
				</Text>

				<View className="mb-4">
					<Text className="text-sm text-gray-600 mb-2 ml-1">
						Username
					</Text>
					<TextInput
						placeholder="Choose a username (min. 3 characters)"
						className="border border-gray-300 p-4 rounded-lg bg-white"
						autoCapitalize="none"
						onChangeText={setUsername}
					/>
				</View>

				<View className="mb-4">
					<Text className="text-sm text-gray-600 mb-2 ml-1">
						Email Address
					</Text>
					<TextInput
						placeholder="Enter your email (e.g., john@example.com)"
						className="border border-gray-300 p-4 rounded-lg bg-white"
						autoCapitalize="none"
						keyboardType="email-address"
						onChangeText={setEmail}
					/>
				</View>

				<View className="mb-4">
					<Text className="text-sm text-gray-600 mb-2 ml-1">
						Password
					</Text>
					<TextInput
						placeholder="Create a strong password (min. 6 characters)"
						className="border border-gray-300 p-4 rounded-lg bg-white"
						secureTextEntry
						onChangeText={setPassword}
					/>
				</View>

				<View className="mb-6">
					<Text className="text-sm text-gray-600 mb-2 ml-1">
						Confirm Password
					</Text>
					<TextInput
						placeholder="Re-enter your password to confirm"
						className="border border-gray-300 p-4 rounded-lg bg-white"
						secureTextEntry
						onChangeText={setConfirmPassword}
					/>
				</View>

				<Pressable
					className="bg-blue-500 py-4 rounded-lg mb-4"
					onPress={onSubmit}
				>
					<Text className="text-white text-center font-semibold text-lg">
						Create Account
					</Text>
				</Pressable>

				<Pressable onPress={() => router.push("/")}>
					<Text className="text-blue-500 text-center">
						Already have an account? Sign In
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
