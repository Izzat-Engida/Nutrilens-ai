import { apiSlice } from '../api/apiSlice';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface LoginResponse {
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/api/accounts/login/',
        method: 'POST',
        body,
      }),
    }),

    signup: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: '/api/accounts/register/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
} = authApi;