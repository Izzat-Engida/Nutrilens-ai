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

export const initialDetectedFoods: DetectedFood[] = [
  {
    id: "rice",
    name: "Rice",
    grams: 250,
    calories: 325,
    protein: 7,
    carbs: 72,
    fat: 1,
    confidence: 94,
  },
  {
    id: "chicken",
    name: "Chicken",
    grams: 150,
    calories: 280,
    protein: 32,
    carbs: 0,
    fat: 16,
    confidence: 89,
  },
  {
    id: "salad",
    name: "Salad",
    grams: 100,
    calories: 60,
    protein: 2,
    carbs: 11,
    fat: 1,
    confidence: 82,
  },
];