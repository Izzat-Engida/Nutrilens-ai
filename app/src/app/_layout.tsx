import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context";
import {Provider} from 'react-redux'
import {store} from '../store'
export default function RootLayout() {
  
  return (
    <Provider store={store}>
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
    </SafeAreaProvider>
    </Provider>
  );
}
