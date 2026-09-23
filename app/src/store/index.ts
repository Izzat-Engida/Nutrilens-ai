import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer, { logout, setAccessToken, setCredentials, setUser } from './auth/authSlice';
import { apiSlice } from './api/apiSlice';
import onboardingReducer from './onboarding/onboardingSlice';
import { clearAuthSession, saveAuthSession } from './auth/authStorage';
import './auth/authApi';
import './onboarding/profileApi';
import './nutrition/nutritionApi';
import './meals/mealsApi';
import './tracking/trackingApi';
import './recommendations/recommendationsApi';
import './analysis/foodAnalysisApi';

const authPersistenceMiddleware = createListenerMiddleware();

authPersistenceMiddleware.startListening({
  actionCreator: setCredentials,
  effect: async (action) => {
    try {
      await saveAuthSession(action.payload);
    } catch (error) {
      console.warn('Unable to persist authentication session', error);
    }
  },
});

authPersistenceMiddleware.startListening({
  actionCreator: setAccessToken,
  effect: async (action, listenerApi) => {
    try {
      const auth = (listenerApi.getState() as RootState).auth;
      if (auth.refreshToken && auth.user) {
        await saveAuthSession({
          accessToken: action.payload,
          refreshToken: auth.refreshToken,
          user: auth.user,
        });
      }
    } catch (error) {
      console.warn('Unable to persist refreshed access token', error);
    }
  },
});

authPersistenceMiddleware.startListening({
  actionCreator: setUser,
  effect: async (_action, listenerApi) => {
    try {
      const auth = (listenerApi.getState() as RootState).auth;
      if (auth.accessToken && auth.refreshToken && auth.user) {
        await saveAuthSession({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: auth.user,
        });
      }
    } catch (error) {
      console.warn('Unable to persist updated user', error);
    }
  },
});

authPersistenceMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    try {
      await clearAuthSession();
    } catch (error) {
      console.warn('Unable to clear authentication session', error);
    }
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authPersistenceMiddleware.middleware)
      .concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
