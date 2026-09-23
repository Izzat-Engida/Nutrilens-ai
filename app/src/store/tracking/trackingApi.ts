import { apiSlice } from '../api/apiSlice';
import type { WeightEntry, WeightProgress } from '../types';

export const trackingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWeightEntries: builder.query<WeightEntry[], void>({
      query: () => '/api/tracking/weight/',
      providesTags: ['Tracking'],
    }),
    getWeightProgress: builder.query<WeightProgress, void>({
      query: () => '/api/tracking/progress/',
      providesTags: ['Tracking'],
    }),
    createWeightEntry: builder.mutation<WeightEntry, { weight_kg: number; date?: string }>({
      query: (body) => ({
        url: '/api/tracking/weight/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tracking', 'Recommendations', 'Profile'],
    }),
    updateWeightEntry: builder.mutation<WeightEntry, { id: number; weight_kg?: number; date?: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/tracking/weight/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Tracking', 'Recommendations'],
    }),
    deleteWeightEntry: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/tracking/weight/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tracking', 'Recommendations'],
    }),
  }),
});

export const {
  useGetWeightEntriesQuery,
  useGetWeightProgressQuery,
  useCreateWeightEntryMutation,
  useUpdateWeightEntryMutation,
  useDeleteWeightEntryMutation,
} = trackingApi;
