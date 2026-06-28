import { create } from "zustand";
import { DetectedFood, MealType } from "@/types/scan";

export type MacroKey = "protein" | "water" | "carbs" | "fat";
export type RecentMealIcon = "drumstick" | "apple" | "beef" | "pizza";

export type MacroProgress = {
  key: MacroKey;
  icon: "Drumstick" | "Droplet" | "Wheat" | "CircleDot";
  title: string;
  total: number;
  consumed: number;
  unit: string;
};

export type RecentMeal = {
  id: string;
  icon: RecentMealIcon;
  foodName: string;
  calories: number;
  time: string;
  portion:string;
  type: MealType;
};

export type WeightPoint = {
  value: number;
  date: string;
  label: string;
  dataPointText: string;
};

type ScanState = {
  foods: DetectedFood[];
  missingFoodText: string;
  mealType: MealType;
  scanCount: number;
  capturedPhotoUri?: string;
  scannedBarcode?: string;
};

type NutritionStore = {
  user: {
    name: string;
    initials: string;
  };
  calorieGoal: number;
  caloriesConsumed: number;
  insight: string;
  streakDays: number;
  macros: MacroProgress[];
  recentMeals: RecentMeal[];
  weightProgress: WeightPoint[];
  currentWeightKg: number;
  scan: ScanState;
  updateScanPhoto: (photoUri: string) => void;
  updateScannedBarcode: (barcode: string) => void;
  updatePortion: (id: string, direction: "down" | "up") => void;
  removeFood: (id: string) => void;
  setMissingFoodText: (text: string) => void;
  setMealType: (mealType: MealType) => void;
  resetScan: () => void;
  saveScannedMeal: () => void;
};

const mockDetectedFoods: DetectedFood[] = [
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

const createScanState = (): ScanState => ({
  foods: mockDetectedFoods.map((food) => ({ ...food })),
  missingFoodText: "",
  mealType: "lunch",
  scanCount: 0,
  capturedPhotoUri: undefined,
  scannedBarcode: undefined,
});

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  user: {
    name: "Alex Chen",
    initials: "AC",
  },
  calorieGoal: 2000,
  caloriesConsumed: 1800,
  insight: "Add 56g more protein to hit today's target",
  streakDays: 14,
  macros: [
    {
      key: "protein",
      icon: "Drumstick",
      title: "Protein",
      total: 140,
      consumed: 84,
      unit: "g",
    },
    {
      key: "water",
      icon: "Droplet",
      title: "Water",
      total: 3,
      consumed: 2,
      unit: "L",
    },
    {
      key: "carbs",
      icon: "Wheat",
      title: "Carbs",
      total: 260,
      consumed: 180,
      unit: "g",
    },
    {
      key: "fat",
      icon: "CircleDot",
      title: "Fat",
      total: 70,
      consumed: 48,
      unit: "g",
    },
  ],
  recentMeals: [
    {
      id: "breakfast-chicken",
      icon: "drumstick",
      foodName: "Grilled Chicken Breast",
      calories: 220,
      time: "08:15 AM",
      portion:"1/2",
      type: "breakfast",
    },
    {
      id: "snack-apple",
      icon: "apple",
      foodName: "Apple & Almonds",
      calories: 180,
      time: "11:00 AM",
      portion:"1/2",
      type: "snack",
    },
    {
      id: "lunch-beef",
      icon: "beef",
      foodName: "Beef Rice Bowl",
      calories: 520,
      time: "01:30 PM",
      portion:"1 plate",
      type: "lunch",
    },
    {
      id: "dinner-wrap",
      icon: "pizza",
      foodName: "Veggie Wrap",
      calories: 320,
      time: "06:45 PM",
      portion:"3 slices",
      type: "dinner",
    },
  ],
  weightProgress: [
    { value: 73.4, date: "Aug 1", label: "", dataPointText: "73.4" },
    { value: 73.0, date: "Aug 8", label: "", dataPointText: "73.0" },
    { value: 72.6, date: "Aug 15", label: "", dataPointText: "72.6" },
    { value: 72.0, date: "Aug 22", label: "", dataPointText: "72.0" },
  ],
  currentWeightKg: 72,
  scan: createScanState(),
  updateScanPhoto: (photoUri) =>
    set((state) => ({
      scan: {
        ...state.scan,
        capturedPhotoUri: photoUri,
        scanCount: state.scan.scanCount + 1,
        scannedBarcode: undefined,
      },
    })),
  updateScannedBarcode: (barcode) =>
    set((state) => ({
      scan: {
        ...state.scan,
        missingFoodText: `Barcode scanned: ${barcode}`,
        scannedBarcode: barcode,
        scanCount: state.scan.scanCount + 1,
      },
    })),
  updatePortion: (id, direction) =>
    set((state) => ({
      scan: {
        ...state.scan,
        foods: state.scan.foods.map((food) => {
          if (food.id !== id) return food;

          const nextGrams =
            direction === "up" ? food.grams + 25 : Math.max(25, food.grams - 25);
          const ratio = nextGrams / food.grams;

          return {
            ...food,
            grams: nextGrams,
            calories: Math.round(food.calories * ratio),
            protein: Math.round(food.protein * ratio),
            carbs: Math.round(food.carbs * ratio),
            fat: Math.round(food.fat * ratio),
          };
        }),
      },
    })),
  removeFood: (id) =>
    set((state) => ({
      scan: {
        ...state.scan,
        foods: state.scan.foods.filter((food) => food.id !== id),
      },
    })),
  setMissingFoodText: (text) =>
    set((state) => ({
      scan: {
        ...state.scan,
        missingFoodText: text,
      },
    })),
  setMealType: (mealType) =>
    set((state) => ({
      scan: {
        ...state.scan,
        mealType,
      },
    })),
  resetScan: () =>
    set({
      scan: createScanState(),
    }),
  saveScannedMeal: () => {
    const { scan } = get();
    const calories = scan.foods.reduce((sum, food) => sum + food.calories, 0);
    const title =
      scan.scannedBarcode && !scan.capturedPhotoUri
        ? "Scanned Barcode Meal"
        : "Scanned Meal";
    const recentMeal: RecentMeal = {
      id: `scan-${Date.now()}`,
      icon: "drumstick",
      foodName: title,
        calories,
        portion: "1 plate",
      type: scan.mealType,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    set((state) => ({
      caloriesConsumed: state.caloriesConsumed + calories,
      recentMeals: [recentMeal, ...state.recentMeals].slice(0, 6),
      scan: createScanState(),
    }));
  },
}));
