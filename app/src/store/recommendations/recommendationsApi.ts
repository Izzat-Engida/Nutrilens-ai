import { apiSlice } from '../api/apiSlice';
import type { Recommendation } from '../types';

export const recommendationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.query<Recommendation[], void>({
      query: () => '/api/recommendations/',
      providesTags: ['Recommendations'],
    }),
    generateRecommendations: builder.mutation<Recommendation[], void>({
      query: () => ({
        url: '/api/recommendations/generate/',
        method: 'POST',
      }),
      invalidatesTags: ['Recommendations'],
    }),
    markRecommendationRead: builder.mutation<Recommendation, { id: number; is_read?: boolean }>({
      query: ({ id, is_read = true }) => ({
        url: `/api/recommendations/${id}/read/`,
        method: 'PATCH',
        body: { is_read },
      }),
      invalidatesTags: ['Recommendations'],
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
  useGenerateRecommendationsMutation,
  useMarkRecommendationReadMutation,
} = recommendationsApi;
