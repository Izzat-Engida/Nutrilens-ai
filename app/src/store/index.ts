import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { apiSlice } from './api/apiSlice';
import onboardingReducer from './onboarding/onboardingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding:onboardingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;