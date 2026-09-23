import { apiSlice } from '../api/apiSlice';
import type { DailyNutrition } from '../types';

export const nutritionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDailyNutrition: builder.query<DailyNutrition, string | void>({
      query: (date) => ({
        url: '/api/nutrition/daily/',
        params: date ? { date } : undefined,
      }),
      providesTags: ['Nutrition'],
    }),
    getNutritionSummary: builder.query<DailyNutrition, string | void>({
      query: (date) => ({
        url: '/api/nutrition/summary/',
        params: date ? { date } : undefined,
      }),
      providesTags: ['Nutrition'],
    }),
    getNutritionHistory: builder.query<DailyNutrition[], { from?: string; to?: string } | void>({
      query: (range) => ({
        url: '/api/nutrition/history/',
        params: range ?? undefined,
      }),
      providesTags: ['Nutrition'],
    }),
  }),
});

export const {
  useGetDailyNutritionQuery,
  useGetNutritionSummaryQuery,
  useGetNutritionHistoryQuery,
} = nutritionApi;
