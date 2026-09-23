import { apiSlice } from '../api/apiSlice';
import type { Meal } from '../types';
import { toNumber } from './nutritionEstimate';

export const mealCalories = (meal: Meal) =>
  meal.items.reduce((sum, item) => sum + toNumber(item.calories), 0);

export const mealMacros = (meal: Meal) =>
  meal.items.reduce(
    (sum, item) => ({
      calories: sum.calories + toNumber(item.calories),
      protein: sum.protein + toNumber(item.protein),
      carbs: sum.carbs + toNumber(item.carbohydrates),
      fat: sum.fat + toNumber(item.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

export const firstFoodName = (meal: Meal) => meal.items[0]?.food_name ?? meal.meal_type;

export const firstPortion = (meal: Meal) => {
  const item = meal.items[0];
  if (!item) return '';
  return `${toNumber(item.quantity)} ${item.unit}`;
};

export const invalidateAppData = () =>
  apiSlice.util.invalidateTags(['Meals', 'Nutrition', 'Tracking', 'Recommendations', 'Profile']);
