import { Stack } from 'expo-router'
import { StatusBar } from "expo-status-bar";

export default function MealsLayout() {
    return (
        <>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="recommendation" />

        </Stack>
         <StatusBar style="dark" />
         </>
    );
}