import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import "../global.css";

export default function RootLayout() {
	return (
		<>
			<Stack>
				<Stack.Screen 
					name="index" 
					options={{ headerShown: false }} 
				/>
				<Stack.Screen 
					name="signup" 
					options={{ headerShown: false }} 
				/>
				<Stack.Screen 
					name="(app)" 
					options={{ headerShown: false }} 
				/>
			</Stack>
			<Toast />
		</>
	);
}
