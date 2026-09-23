import type { MealType } from '@/types/scan';

export interface DailyNutrition {
  date: string;
  calorie_goal: number;
  calories_consumed: number;
  calories_remaining: number;
  protein_goal: number;
  protein_consumed: number;
  protein_remaining: number;
  carbs_goal: number;
  carbs_consumed: number;
  carbs_remaining: number;
  fat_goal: number;
  fat_consumed: number;
  fat_remaining: number;
}

export interface MealItem {
  id?: number;
  food_name: string;
  quantity: number | string;
  unit: string;
  calories: number | string;
  protein: number | string;
  carbohydrates: number | string;
  fat: number | string;
}

export interface Meal {
  id: number;
  meal_type: MealType;
  consumed_at: string;
  notes: string;
  items: MealItem[];
  created_at: string;
  updated_at: string;
}

export interface MealWritePayload {
  meal_type: MealType;
  consumed_at?: string;
  notes?: string;
  items: Omit<MealItem, 'id'>[];
}

export interface WeightEntry {
  id: number;
  weight_kg: number | string;
  date: string;
  created_at: string;
}

export interface WeightProgress {
  current_weight: number | string | null;
  starting_weight: number | string | null;
  lowest_weight: number | string | null;
  highest_weight: number | string | null;
  total_change: number | string | null;
  target_weight: number | string | null;
  target_progress_percent: number | string | null;
  entries_count: number;
  history: WeightEntry[];
}

export interface Recommendation {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface FoodPrediction {
  label: string;
  confidence: number;
}

export interface FoodAnalysis {
  id: number;
  status: 'pending' | 'completed' | 'failed' | 'confirmed';
  predictions: FoodPrediction[];
  detected_food: string;
  confidence: number | string | null;
  estimated_portion_grams: number | string | null;
  nutrition: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  } | null;
  created_at: string;
}
