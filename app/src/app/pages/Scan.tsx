import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanCameraView from "@/components/ScanCameraView";
import ScanReviewView from "@/components/ScanReviewView";
import ScanSummaryView from "@/components/ScanSummaryView";
import {
  DetectedFood,
  initialDetectedFoods,
  MealType,
  ScanStep,
} from "../../types/scan";

const ScanScreen = () => {
  const [step, setStep] = useState<ScanStep>("camera");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [foods, setFoods] = useState<DetectedFood[]>(initialDetectedFoods);
  const [missingFoodText, setMissingFoodText] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [scanCount, setScanCount] = useState(0);

  const totals = useMemo(
    () =>
      foods.reduce(
        (sum, food) => ({
          calories: sum.calories + food.calories,
          protein: sum.protein + food.protein,
          carbs: sum.carbs + food.carbs,
          fat: sum.fat + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [foods]
  );

  const updatePortion = (id: string, direction: "down" | "up") => {
    setFoods((currentFoods) =>
      currentFoods.map((food) => {
        if (food.id !== id) return food;

        const nextGrams =
          direction === "up"
            ? food.grams + 25
            : Math.max(25, food.grams - 25);

        const ratio = nextGrams / food.grams;

        return {
          ...food,
          grams: nextGrams,
          calories: Math.round(food.calories * ratio),
          protein: Math.round(food.protein * ratio),
          carbs: Math.round(food.carbs * ratio),
          fat: Math.round(food.fat * ratio),
        };
      })
    );
  };

  const removeFood = (id: string) => {
    setFoods((currentFoods) => currentFoods.filter((food) => food.id !== id));
  };

  const startReview = () => {
    setScanCount((count) => count + 1);
    setStep("review");
  };

  const resetScan = () => {
    setFoods(initialDetectedFoods);
    setMissingFoodText("");
    setMealType("lunch");
    setScanCount(0);
    setStep("camera");
  };

  if (step === "camera") {
    return (
      <SafeAreaView style={styles.container}>
        <ScanCameraView
          flashEnabled={flashEnabled}
          scanCount={scanCount}
          onToggleFlash={() => setFlashEnabled((enabled) => !enabled)}
          onStartReview={startReview}
          onResetPreview={() => setScanCount(0)}
        />
      </SafeAreaView>
    );
  }

  if (step === "review") {
    return (
      <SafeAreaView style={styles.container}>
        <ScanReviewView
          foods={foods}
          missingFoodText={missingFoodText}
          scanCount={scanCount}
          onBack={() => setStep("camera")}
          onReset={resetScan}
          onChangeMissingFood={setMissingFoodText}
          onIncreasePortion={(id) => updatePortion(id, "up")}
          onDecreasePortion={(id) => updatePortion(id, "down")}
          onRemoveFood={removeFood}
          onCalculate={() => setStep("summary")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScanSummaryView
        totals={totals}
        scanCount={scanCount}
        mealType={mealType}
        missingFoodText={missingFoodText}
        onBack={() => setStep("review")}
        onSelectMealType={setMealType}
        onSave={resetScan}
      />
    </SafeAreaView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
});