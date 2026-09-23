import { apiSlice } from '../api/apiSlice';
import type { User } from '../auth/authSlice';

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

interface AccountUpdateRequest {
  full_name?: string;
  email?: string;
}

interface AccountUpdateResponse {
  message: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
}

interface MessageResponse {
  message: string;
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
    updateAccount: builder.mutation<AccountUpdateResponse, AccountUpdateRequest>({
      query: (body) => ({
        url: '/api/accounts/account/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Account'],
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/api/accounts/account/',
        method: 'DELETE',
      }),
    }),
    requestPasswordReset: builder.mutation<MessageResponse, { email: string }>({
      query: (body) => ({
        url: '/api/accounts/password-reset/',
        method: 'POST',
        body,
      }),
    }),
    confirmPasswordReset: builder.mutation<
      MessageResponse,
      { token: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: '/api/accounts/password-reset/confirm/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
} = authApi;
