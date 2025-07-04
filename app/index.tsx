import { signinService } from "@/src/lib/auth/auth-service";
import api from "@/src/utils/api/api-client";
import { showToast } from "@/src/utils/toast/toast";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SigninScreen() {
	const [email, setEmail] = useState("user1@gmail.com");
	const [password, setPassword] = useState("password");
	const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

	const checkServerHealth = async () => {
		try {
			setServerStatus('checking');
			const response = await api.get('/');
			if (response?.message === "Welcome to Poly Play") {
				setServerStatus('online');
				showToast.success("Server is online");
			} else {
				setServerStatus('offline');
			}
		} catch {
			setServerStatus('offline');
			showToast.error("Server is offline");
		}
	};

	useEffect(() => {
		checkServerHealth();
	}, []);

	const onSubmit = async () => {
		if (serverStatus === 'offline') {
			showToast.error("Server is offline. Please check your connection.");
			return;
		}

		try {
			await signinService({ email, password });
			showToast.success("Logged in successfully");
			router.replace("/(app)/home");
		} catch (err: any) {
			showToast.error(err.message || "signin failed");
		}
	};

	return (
		<View className="flex-1 justify-center px-6 bg-gray-50">
			<View className="w-full max-w-sm mx-auto">
				<Text className="text-3xl font-bold mb-2 text-center text-gray-800">
					Poly Play
				</Text>
				<Text className="text-sm text-center mb-4 text-gray-600">
					Online Multiplayer Ludo Game
				</Text>

				{/* Server Status Indicator */}
				<View className="flex-row items-center justify-center mb-6">
					<View className={`w-3 h-3 rounded-full mr-2 ${
						serverStatus === 'online' ? 'bg-green-500' : 
						serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
					}`} />
					<Text className={`text-sm ${
						serverStatus === 'online' ? 'text-green-600' : 
						serverStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
					}`}>
						Server: {serverStatus === 'checking' ? 'Checking...' : 
								 serverStatus === 'online' ? 'Online' : 'Offline'}
					</Text>
					<Pressable 
						onPress={checkServerHealth}
						className="ml-2 px-2 py-1 bg-gray-200 rounded"
					>
						<Text className="text-xs text-gray-600">Retry</Text>
					</Pressable>
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
                        defaultValue="user1@gmail.com"
						onChangeText={setEmail}
					/>
				</View>

				<View className="mb-6">
					<Text className="text-sm text-gray-600 mb-2 ml-1">
						Password
					</Text>
					<TextInput
						placeholder="Enter your password (min. 6 characters)"
						className="border border-gray-300 p-4 rounded-lg bg-white"
                        defaultValue="password"
						onChangeText={setPassword}
					/>
				</View>

				<Pressable
					className="bg-blue-500 py-4 rounded-lg mb-4"
					onPress={onSubmit}
				>
					<Text className="text-white text-center font-semibold text-lg">
						Sign In
					</Text>
				</Pressable>

				<Pressable onPress={() => router.push("/signup")}>
					<Text className="text-blue-500 text-center">
						Don&apos;t have an account? Sign Up
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
