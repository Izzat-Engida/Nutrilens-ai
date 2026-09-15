import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context";
import {Provider} from 'react-redux'
import {store} from '../store'
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { finishAuthRestoration, setCredentials } from '../store/auth/authSlice';
import { restoreAuthSession } from '../store/auth/authStorage';
import type { RootState } from '../store';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppBootstrap() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isRestoring } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isRestoring && !accessToken && pathname.startsWith('/pages')) {
      router.replace('/(auth)/sign-in');
    }
  }, [accessToken, isRestoring, pathname, router]);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      try {
        const session = await restoreAuthSession();
        if (active && session) {
          dispatch(setCredentials(session));
        }
      } catch (error) {
        console.warn('Unable to restore authentication session', error);
      } finally {
        if (active) {
          dispatch(finishAuthRestoration());
          await SplashScreen.hideAsync().catch(() => undefined);
        }
      }
    };

    void restore();
    return () => {
      active = false;
    };
  }, [dispatch]);

  if (isRestoring) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0071E3" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppBootstrap />
      <StatusBar style="dark" />
    </GestureHandlerRootView>
    </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
