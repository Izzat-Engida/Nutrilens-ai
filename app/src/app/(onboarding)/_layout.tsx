import { Stack } from 'expo-router'
import { StatusBar } from "expo-status-bar";

const OnboardingLayout = () => {
  return(<>
  <Stack screenOptions={{ headerShown: false}}>
    <Stack.Screen name="Welcome" />
    <Stack.Screen name="Goals"/>
  </Stack>
  <StatusBar style="dark" />
  </>)
}

export default OnboardingLayout