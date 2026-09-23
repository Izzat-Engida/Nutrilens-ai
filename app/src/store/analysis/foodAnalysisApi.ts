import { Platform } from 'react-native';
import { apiSlice } from '../api/apiSlice';
import type { FoodAnalysis } from '../types';

const buildImageBody = async (uri: string) => {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('image', blob, 'meal.jpg');
    return formData;
  }

  formData.append('image', {
    uri,
    name: 'meal.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);
  return formData;
};

export const foodAnalysisApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    analyzeFood: builder.mutation<FoodAnalysis, string>({
      async queryFn(uri, _api, _extraOptions, baseQuery) {
        const body = await buildImageBody(uri);
        const result = await baseQuery({
          url: '/api/food-analysis/analyze/',
          method: 'POST',
          body,
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: result.data as FoodAnalysis };
      },
      invalidatesTags: ['FoodAnalysis'],
    }),
    getFoodAnalysisHistory: builder.query<FoodAnalysis[], void>({
      query: () => '/api/food-analysis/history/',
      providesTags: ['FoodAnalysis'],
    }),
    getFoodAnalysis: builder.query<FoodAnalysis, number>({
      query: (id) => `/api/food-analysis/history/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'FoodAnalysis', id }],
    }),
    confirmFoodAnalysis: builder.mutation<
      FoodAnalysis,
      { id: number; detected_food?: string; estimated_portion_grams?: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/food-analysis/${id}/confirm/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FoodAnalysis'],
    }),
  }),
});

export const {
  useAnalyzeFoodMutation,
  useGetFoodAnalysisHistoryQuery,
  useGetFoodAnalysisQuery,
  useConfirmFoodAnalysisMutation,
} = foodAnalysisApi;
