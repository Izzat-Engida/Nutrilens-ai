import { Stack } from 'expo-router'
import { StatusBar } from "expo-status-bar";

const OnboardingLayout = () => {
  <>
  <Stack screenOptions={{ headerShown: false}}>
    <Stack.Screen name="Welcome" />
  </Stack>
  <StatusBar style="dark" />
  </>
}

export default OnboardingLayout