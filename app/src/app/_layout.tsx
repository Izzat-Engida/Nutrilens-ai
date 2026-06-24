import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  
  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
