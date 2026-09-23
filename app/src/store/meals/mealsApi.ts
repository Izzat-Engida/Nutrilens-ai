import { apiSlice } from '../api/apiSlice';
import type { Meal, MealWritePayload } from '../types';

export const mealsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query<Meal[], { date?: string; from?: string; to?: string } | void>({
      query: (params) => ({
        url: '/api/meals/',
        params: params ?? undefined,
      }),
      providesTags: ['Meals'],
    }),
    getMeal: builder.query<Meal, number>({
      query: (id) => `/api/meals/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Meals', id }],
    }),
    createMeal: builder.mutation<Meal, MealWritePayload>({
      query: (body) => ({
        url: '/api/meals/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Meals', 'Nutrition', 'Recommendations'],
    }),
    updateMeal: builder.mutation<Meal, { id: number } & Partial<MealWritePayload>>({
      query: ({ id, ...body }) => ({
        url: `/api/meals/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Meals', 'Nutrition', 'Recommendations'],
    }),
    deleteMeal: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/meals/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Meals', 'Nutrition', 'Recommendations'],
    }),
  }),
});

export const {
  useGetMealsQuery,
  useGetMealQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = mealsApi;
