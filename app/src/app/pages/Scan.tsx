import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanCameraView from "@/components/ScanCameraView";
import ScanReviewView from "@/components/ScanReviewView";
import ScanSummaryView from "@/components/ScanSummaryView";
import { useNutritionStore } from "@/store/nutritionStore";
import { ScanStep } from "../../types/scan";

const ScanScreen = () => {
  const [step, setStep] = useState<ScanStep>("camera");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const scan = useNutritionStore((state) => state.scan);
  const updateScanPhoto = useNutritionStore((state) => state.updateScanPhoto);
  const updateScannedBarcode = useNutritionStore((state) => state.updateScannedBarcode);
  const updatePortion = useNutritionStore((state) => state.updatePortion);
  const removeFood = useNutritionStore((state) => state.removeFood);
  const setMissingFoodText = useNutritionStore((state) => state.setMissingFoodText);
  const setMealType = useNutritionStore((state) => state.setMealType);
  const resetScanStore = useNutritionStore((state) => state.resetScan);
  const saveScannedMeal = useNutritionStore((state) => state.saveScannedMeal);

  const totals = useMemo(
    () =>
      scan.foods.reduce(
        (sum, food) => ({
          calories: sum.calories + food.calories,
          protein: sum.protein + food.protein,
          carbs: sum.carbs + food.carbs,
          fat: sum.fat + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [scan.foods]
  );

  const startReviewWithPhoto = (photoUri: string) => {
    updateScanPhoto(photoUri);
    setStep("review");
  };

  const startReviewWithBarcode = (barcode: string) => {
    updateScannedBarcode(barcode);
    setStep("review");
  };

  const resetScan = () => {
    resetScanStore();
    setStep("camera");
  };

  const saveMeal = () => {
    saveScannedMeal();
    setStep("camera");
  };

  if (step === "camera") {
    return (
      <SafeAreaView style={styles.container}>
        <ScanCameraView
          flashEnabled={flashEnabled}
          scanCount={scan.scanCount}
          onToggleFlash={() => setFlashEnabled((enabled) => !enabled)}
          onCapturePhoto={startReviewWithPhoto}
          onBarcodeScanned={startReviewWithBarcode}
          onResetPreview={resetScanStore}
        />
      </SafeAreaView>
    );
  }

  if (step === "review") {
    return (
      <SafeAreaView style={styles.container}>
        <ScanReviewView
          foods={scan.foods}
          imageUri={scan.capturedPhotoUri}
          missingFoodText={scan.missingFoodText}
          scanCount={scan.scanCount}
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
        imageUri={scan.capturedPhotoUri}
        scanCount={scan.scanCount}
        mealType={scan.mealType}
        missingFoodText={scan.missingFoodText}
        onBack={() => setStep("review")}
        onSelectMealType={setMealType}
        onSave={saveMeal}
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
