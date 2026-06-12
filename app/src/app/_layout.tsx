import { useColorScheme } from 'react-native';
import { GalioProvider } from 'galio-framework';
import { nutrilensTheme } from '@/constants/galio';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GalioProvider theme={nutrilensTheme} mode={colorScheme}>
       <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
       </Stack>
       <StatusBar style="dark" />
    </GalioProvider>
  );
}
