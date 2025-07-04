import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
	const handleCreateGame = () => {
		// TODO: Implement create game functionality
		console.log("Create game");
	};

	const handleJoinGame = () => {
		// TODO: Implement join game functionality
		console.log("Join game");
	};

	const handleQuickMatch = () => {
		// TODO: Implement quick match functionality
		console.log("Quick match");
	};

	const handleLogout = () => {
		// TODO: Implement logout functionality
		router.push("/");
	};

	return (
		<View className="flex-1 bg-gray-50">
			<View className="pt-12 pb-6 px-6 bg-blue-500">
				<View className="flex-row justify-between items-center">
					<Text className="text-white text-2xl font-bold">
						Poly Play
					</Text>
					<Pressable
						onPress={handleLogout}
						className="bg-blue-600 px-4 py-2 rounded-lg"
					>
						<Text className="text-white font-medium">Logout</Text>
					</Pressable>
				</View>
			</View>

			<ScrollView className="flex-1 px-6">
				<View className="mt-8">
					<Text className="text-xl font-bold text-gray-800 mb-6">
						Game Options
					</Text>

					<View className="space-y-4">
						<Pressable
							className="bg-green-500 py-6 rounded-lg"
							onPress={handleQuickMatch}
						>
							<Text className="text-white text-center font-semibold text-lg">
								Quick Match
							</Text>
							<Text className="text-green-100 text-center text-sm mt-1">
								Find a random opponent
							</Text>
						</Pressable>

						<Pressable
							className="bg-blue-500 py-6 rounded-lg"
							onPress={handleCreateGame}
						>
							<Text className="text-white text-center font-semibold text-lg">
								Create Game Room
							</Text>
							<Text className="text-blue-100 text-center text-sm mt-1">
								Invite friends to play
							</Text>
						</Pressable>

						<Pressable
							className="bg-purple-500 py-6 rounded-lg"
							onPress={handleJoinGame}
						>
							<Text className="text-white text-center font-semibold text-lg">
								Join Game Room
							</Text>
							<Text className="text-purple-100 text-center text-sm mt-1">
								Enter room code
							</Text>
						</Pressable>
					</View>
				</View>

				<View className="mt-8 mb-6">
					<Text className="text-lg font-bold text-gray-800 mb-4">
						Recent Games
					</Text>
					<View className="bg-white p-4 rounded-lg border border-gray-200">
						<Text className="text-gray-500 text-center">
							No recent games yet
						</Text>
						<Text className="text-gray-400 text-center text-sm mt-1">
							Start playing to see your game history
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
