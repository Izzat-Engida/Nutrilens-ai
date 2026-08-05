import { Stack } from 'expo-router'
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  
     return(<>
  <Stack screenOptions={{ headerShown: false}}>
    <Stack.Screen name="forgot-password" />
    <Stack.Screen name="sign-in" />
    <Stack.Screen name="sign-up" />
  </Stack>
  <StatusBar style="dark" />
  </>)

}

export default AuthLayout