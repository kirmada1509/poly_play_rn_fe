import { router } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";

export default function Index() {
	return (
		<ScrollView className="flex-1 bg-ludo-background-primary">
			{/* Header */}
			<View className="px-6 py-8 bg-ludo-background-card shadow-lg">
				<Text className="text-3xl font-bold text-ludo-text-primary text-center">
					� Poly Play 
				</Text>
				<Button
					title="components"
					onPress={() => router.push("/components-demo")}
				></Button>
				<Text className="text-lg text-ludo-text-secondary text-center mt-2">
					Dreamy Pastel Theme Showcase
				</Text>
			</View>

			{/* Player Colors Section */}
			<View className="p-6">
				<Text className="text-2xl font-bold text-ludo-text-primary mb-4">
					🎮 Player Colors
				</Text>
				<View className="flex-row flex-wrap gap-3">
					<PlayerColorCard color="red" name="Red Player" />
					<PlayerColorCard color="blue" name="Blue Player" />
					<PlayerColorCard color="green" name="Green Player" />
					<PlayerColorCard color="yellow" name="Yellow Player" />
				</View>
			</View>

			{/* Board Colors Section */}
			<View className="p-6">
				<Text className="text-2xl font-bold text-ludo-text-primary mb-4">
					🎯 Board Elements
				</Text>
				<View className="space-y-3">
					<BoardColorCard
						color="bg-ludo-board-light"
						name="Board Background"
						description="Main board surface"
					/>
					<BoardColorCard
						color="bg-ludo-board-path"
						name="Game Path"
						description="Player movement track"
					/>
					<BoardColorCard
						color="bg-ludo-board-safe"
						name="Safe Zones"
						description="Protected areas"
					/>
					<BoardColorCard
						color="bg-ludo-board-home"
						name="Home Areas"
						description="Starting positions"
					/>
					<BoardColorCard
						color="bg-ludo-board-center"
						name="Center Victory"
						description="Winning destination"
					/>
				</View>
			</View>

			{/* Accent Colors Section */}
			<View className="p-6">
				<Text className="text-2xl font-bold text-ludo-text-primary mb-4">
					✨ Accent Colors
				</Text>
				<View className="flex-row flex-wrap gap-3">
					<AccentColorCard color="bg-ludo-accent-gold" name="Gold" />
					<AccentColorCard
						color="bg-ludo-accent-success"
						name="Success"
					/>
					<AccentColorCard
						color="bg-ludo-accent-warning"
						name="Warning"
					/>
					<AccentColorCard
						color="bg-ludo-accent-error"
						name="Error"
					/>
					<AccentColorCard color="bg-ludo-accent-info" name="Info" />
				</View>
			</View>

			{/* Sample Game UI Elements */}
			<View className="p-6">
				<Text className="text-2xl font-bold text-ludo-text-primary mb-4">
					🎪 Sample UI Elements
				</Text>

				{/* Game Buttons */}
				<View className="space-y-4">
					<View className="bg-ludo-red-500 p-4 rounded-xl shadow-lg">
						<Text className="text-white text-center font-bold text-lg">
							🎲 Roll Dice
						</Text>
					</View>

					<View className="bg-ludo-accent-gold p-4 rounded-xl shadow-lg">
						<Text className="text-ludo-text-primary text-center font-bold text-lg">
							🏆 Start Game
						</Text>
					</View>

					<View className="bg-ludo-background-card border-2 border-ludo-border-medium p-4 rounded-xl">
						<Text className="text-ludo-text-primary font-bold">
							Player Stats
						</Text>
						<Text className="text-ludo-text-secondary mt-1">
							Games Won: 15 | Current Streak: 3
						</Text>
					</View>
				</View>
			</View>

			{/* Color Palette Grid */}
			<View className="p-6">
				<Text className="text-2xl font-bold text-ludo-text-primary mb-4">
					🎨 Complete Color Palette
				</Text>
				<ColorPaletteGrid />
			</View>

			{/* Footer */}
			<View className="p-6 bg-ludo-board-border">
				<Text className="text-white text-center">
					� Ready to play? Let the dreamy games begin! �
				</Text>
			</View>
		</ScrollView>
	);
}

// Component for player color cards
function PlayerColorCard({ color, name }: { color: string; name: string }) {
	return (
		<View
			className={`flex-1 min-w-[150px] bg-ludo-${color}-500 p-4 rounded-xl shadow-lg`}
		>
			<View
				className={`w-12 h-12 bg-ludo-${color}-600 rounded-full mb-3 mx-auto`}
			/>
			<Text className="text-white text-center font-bold">{name}</Text>
			<Text className="text-white text-center text-sm opacity-90">
				Primary: ludo-{color}-500
			</Text>
		</View>
	);
}

// Component for board color cards
function BoardColorCard({
	color,
	name,
	description,
}: {
	color: string;
	name: string;
	description: string;
}) {
	return (
		<View
			className={`${color} p-4 rounded-xl border border-ludo-border-light shadow-md`}
		>
			<Text className="text-ludo-text-primary font-bold">{name}</Text>
			<Text className="text-ludo-text-secondary text-sm">
				{description}
			</Text>
			<Text className="text-ludo-text-muted text-xs mt-1">{color}</Text>
		</View>
	);
}

// Component for accent color cards
function AccentColorCard({ color, name }: { color: string; name: string }) {
	return (
		<View className={`${color} p-3 rounded-lg shadow-md min-w-[80px]`}>
			<Text className="text-white text-center font-bold text-sm">
				{name}
			</Text>
		</View>
	);
}

// Complete color palette grid
function ColorPaletteGrid() {
	const colorCategories = [
		{
			name: "Red Shades",
			colors: [
				"50",
				"100",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"800",
				"900",
			],
			prefix: "ludo-red",
		},
		{
			name: "Blue Shades",
			colors: [
				"50",
				"100",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"800",
				"900",
			],
			prefix: "ludo-blue",
		},
		{
			name: "Green Shades",
			colors: [
				"50",
				"100",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"800",
				"900",
			],
			prefix: "ludo-green",
		},
		{
			name: "Yellow Shades",
			colors: [
				"50",
				"100",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"800",
				"900",
			],
			prefix: "ludo-yellow",
		},
	];

	return (
		<View className="space-y-4">
			{colorCategories.map((category) => (
				<View key={category.name}>
					<Text className="text-lg font-bold text-ludo-text-primary mb-2">
						{category.name}
					</Text>
					<View className="flex-row flex-wrap gap-1">
						{category.colors.map((shade) => (
							<View
								key={shade}
								className={`bg-${category.prefix}-${shade} w-12 h-12 rounded border border-ludo-border-light`}
							>
								<Text
									className={`text-xs text-center mt-8 ${
										parseInt(shade) >= 500
											? "text-white"
											: "text-gray-800"
									}`}
								>
									{shade}
								</Text>
							</View>
						))}
					</View>
				</View>
			))}
		</View>
	);
}
