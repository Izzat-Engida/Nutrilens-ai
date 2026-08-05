export type ScanStep = "camera" | "review" | "summary";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DetectedFood = {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
};

export const mealTypes: { label: string; value: MealType }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];
