import { router } from "expo-router";
import { Button, ScrollView, Text, View, useColorScheme } from "react-native";

export default function Index() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<ScrollView className={`flex-1 ${isDark ? 'bg-ludo-background-darkPrimary' : 'bg-ludo-background-primary'}`}>
			{/* Header */}
			<View className={`px-6 py-8 ${isDark ? 'bg-ludo-background-darkSecondary' : 'bg-ludo-surface'} shadow-md`}>
				<Text className={`text-3xl font-bold ${isDark ? 'text-ludo-text-darkPrimary' : 'text-ludo-text-primary'} text-center`}>
					🎨 Poly Play
				</Text>
				<Button
					title="Components"
					onPress={() => router.push("/components-demo")}
				/>
				<Text className={`text-lg ${isDark ? 'text-ludo-text-darkSecondary' : 'text-ludo-text-secondary'} text-center mt-2`}>
					Dreamy Pastel Theme Showcase
				</Text>
			</View>

			{/* Sections */}
			<Section title="🎮 Player Colors" isDark={isDark}>
				<View className="flex-row flex-wrap gap-3">
					<PlayerColorCard color="red" name="Red Player" />
					<PlayerColorCard color="blue" name="Blue Player" />
					<PlayerColorCard color="green" name="Green Player" />
					<PlayerColorCard color="yellow" name="Yellow Player" />
				</View>
			</Section>

			<Section title="🎯 Board Elements" isDark={isDark}>
				<View className="space-y-3">
					<BoardColorCard color="bg-ludo-board-light" name="Board Background" description="Main board surface" isDark={isDark} />
					<BoardColorCard color="bg-ludo-board-path" name="Game Path" description="Player movement track" isDark={isDark} />
					<BoardColorCard color="bg-ludo-board-safe" name="Safe Zones" description="Protected areas" isDark={isDark} />
					<BoardColorCard color="bg-ludo-board-home" name="Home Areas" description="Starting positions" isDark={isDark} />
					<BoardColorCard color="bg-ludo-board-center" name="Center Victory" description="Winning destination" isDark={isDark} />
				</View>
			</Section>

			<Section title="✨ Accent Colors" isDark={isDark}>
				<View className="flex-row flex-wrap gap-3">
					<AccentColorCard color="bg-ludo-accent-gold" name="Gold" />
					<AccentColorCard color="bg-ludo-accent-success" name="Success" />
					<AccentColorCard color="bg-ludo-accent-warning" name="Warning" />
					<AccentColorCard color="bg-ludo-accent-error" name="Error" />
					<AccentColorCard color="bg-ludo-accent-info" name="Info" />
				</View>
			</Section>

			<Section title="🎪 Sample UI Elements" isDark={isDark}>
				<View className="space-y-4">
					<View className={`${isDark ? 'bg-ludo-red-600' : 'bg-ludo-red-500'} p-4 rounded-xl ${isDark ? 'shadow-game-dark' : 'shadow-md'}`}>
						<Text className="text-white text-center font-bold text-lg">🎲 Roll Dice</Text>
					</View>

					<View className={`${isDark ? 'bg-ludo-accent-gold/80' : 'bg-ludo-accent-gold'} p-4 rounded-xl ${isDark ? 'shadow-game-dark' : 'shadow-md'}`}>
						<Text className={`${isDark ? 'text-ludo-text-darkPrimary' : 'text-ludo-text-primary'} text-center font-bold text-lg`}>🏆 Start Game</Text>
					</View>

					<View className={`${isDark ? 'bg-ludo-background-darkCard' : 'bg-ludo-surface'} p-4 rounded-xl border ${isDark ? 'border-ludo-border-darkMedium' : 'border-ludo-border-medium'}`}>
						<Text className={`${isDark ? 'text-ludo-text-darkPrimary' : 'text-ludo-text-primary'} font-bold`}>Player Stats</Text>
						<Text className={`${isDark ? 'text-ludo-text-darkSecondary' : 'text-ludo-text-secondary'} mt-1`}>Games Won: 15 | Current Streak: 3</Text>
					</View>
				</View>
			</Section>

			<Section title="🎨 Complete Color Palette" isDark={isDark}>
				<ColorPaletteGrid isDark={isDark} />
			</Section>

			{/* Footer */}
			<View className={`p-6 ${isDark ? 'bg-ludo-background-darkSecondary' : 'bg-ludo-board-border'}`}>
				<Text className={`${isDark ? 'text-ludo-text-darkPrimary' : 'text-white'} text-center`}>🌙 Ready to play? Let the dreamy games begin!</Text>
			</View>
		</ScrollView>
	);
}

// Section Wrapper
function Section({ title, children, isDark = false }: { title: string; children: React.ReactNode; isDark?: boolean }) {
	return (
		<View className="p-6">
			<Text className={`text-2xl font-bold ${isDark ? 'text-ludo-text-darkPrimary' : 'text-ludo-text-primary'} mb-4`}>{title}</Text>
			{children}
		</View>
	);
}

// Player Card
function PlayerColorCard({ color, name }: { color: string; name: string }) {
	return (
		<View className={`flex-1 min-w-[150px] bg-ludo-${color}-500 p-4 rounded-xl shadow-md`}>
			<View className={`w-12 h-12 bg-ludo-${color}-600 rounded-full mb-3 mx-auto`} />
			<Text className="text-white text-center font-bold">{name}</Text>
			<Text className="text-white text-center text-sm opacity-80">Primary: ludo-{color}-500</Text>
		</View>
	);
}

// Board Card
function BoardColorCard({
	color,
	name,
	description,
	isDark = false,
}: {
	color: string;
	name: string;
	description: string;
	isDark?: boolean;
}) {
	return (
		<View className={`${isDark ? 'bg-ludo-background-darkCard' : color} p-4 rounded-xl border ${isDark ? 'border-ludo-border-darkLight' : 'border-ludo-border-light'} ${isDark ? 'shadow-game-dark' : 'shadow-sm'}`}>
			<Text className={`${isDark ? 'text-ludo-text-darkPrimary' : 'text-ludo-text-primary'} font-bold`}>{name}</Text>
			<Text className={`${isDark ? 'text-ludo-text-darkSecondary' : 'text-ludo-text-secondary'} text-sm`}>{description}</Text>
			<Text className={`${isDark ? 'text-ludo-text-darkMuted' : 'text-ludo-text-muted'} text-xs mt-1`}>{color}</Text>
		</View>
	);
}

// Accent Card
function AccentColorCard({ color, name }: { color: string; name: string }) {
	return (
		<View className={`${color} p-3 rounded-lg shadow-sm min-w-[80px]`}>
			<Text className="text-white text-center font-bold text-sm">{name}</Text>
		</View>
	);
}

// Color Palette
function ColorPaletteGrid({ isDark = false }: { isDark?: boolean }) {
	const colorCategories = [
		{ name: "Red Shades", prefix: "ludo-red" },
		{ name: "Blue Shades", prefix: "ludo-blue" },
		{ name: "Green Shades", prefix: "ludo-green" },
		{ name: "Yellow Shades", prefix: "ludo-yellow" },
	];

	const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

	return (
		<View className="space-y-6">
			{colorCategories.map(({ name, prefix }) => (
				<View key={name}>
					<Text className={`text-lg font-bold ${isDark ? 'text-ludo-text-darkPrimary' : 'text-ludo-text-primary'} mb-2`}>{name}</Text>
					<View className="flex-row flex-wrap gap-1">
						{shades.map((shade) => (
							<View
								key={shade}
								className={`bg-${prefix}-${shade} w-12 h-12 rounded border ${isDark ? 'border-ludo-border-darkLight' : 'border-ludo-border-light'} items-center justify-end`}
							>
								<Text
									className={`text-xs mb-1 ${
										parseInt(shade) >= 500 ? "text-white" : isDark ? "text-gray-300" : "text-gray-800"
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
