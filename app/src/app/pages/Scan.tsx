import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanCameraView from "@/components/ScanCameraView";
import ScanSummaryView from "@/components/ScanSummaryView";
import { useNutritionStore } from "@/store/nutritionStore";
import { ScanStep } from "../../types/scan";
import DetectedFoodCard from "@/components/DetectedFoodCard";
import { ChevronRight, RefreshCcw, Sparkles } from "lucide-react-native";

const ScanScreen = () => {
  const [step, setStep] = useState<ScanStep>("camera");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewPhotoUri, setPreviewPhotoUri] = useState<string | undefined>();
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

  useEffect(() => {
    if (!isAnalyzing) return;

    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setStep("review");
    }, 1200);

    return () => clearTimeout(timer);
  }, [isAnalyzing]);

  const startReviewWithPhoto = (photoUri: string) => {
    updateScanPhoto(photoUri);
    setPreviewPhotoUri(photoUri);
    setIsAnalyzing(true);
  };

  const startReviewWithBarcode = (barcode: string) => {
    updateScannedBarcode(barcode);
    setPreviewPhotoUri(undefined);
    setIsAnalyzing(true);
  };

  const resetScan = () => {
    setIsAnalyzing(false);
    setPreviewPhotoUri(undefined);
    resetScanStore();
    setStep("camera");
  };

  const saveMeal = () => {
    setPreviewPhotoUri(undefined);
    saveScannedMeal();
    setStep("camera");
  };

  const resetPreview = () => {
    setIsAnalyzing(false);
    setPreviewPhotoUri(undefined);
    resetScanStore();
     setStep("camera");
  };

  const reviewSheet = (
    <View>
      <View style={styles.sheetHeader}>
        <View>
          <Text style={styles.sheetTitle}>Review meal</Text>
          <Text style={styles.sheetSubtitle}>Adjust portions before calculating.</Text>
        </View>

        <View style={styles.aiBadge}>
          <Sparkles size={14} color="#0071E3" />
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </View>

      <View style={styles.foodList}>
        {scan.foods.map((food) => (
          <DetectedFoodCard
            key={food.id}
            food={food}
            onDecrease={() => updatePortion(food.id, "down")}
            onIncrease={() => updatePortion(food.id, "up")}
            onRemove={() => removeFood(food.id)}
          />
        ))}
      </View>

      <View style={styles.inputBlock}>
        <Text style={styles.inputLabel}>Anything missing?</Text>
        <TextInput
          multiline
          onChangeText={setMissingFoodText}
          placeholder="Example: one Coke and two boiled eggs"
          placeholderTextColor="#9CA3AF"
          style={styles.textArea}
          value={scan.missingFoodText}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={resetScan} style={styles.secondaryButton}>
          <RefreshCcw size={18} color="#111827" />
          <Text style={styles.secondaryButtonText}>Re-scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={scan.foods.length === 0}
          onPress={() => setStep("summary")}
          style={[
            styles.primaryButton,
            scan.foods.length === 0 && styles.primaryButtonDisabled,
          ]}
        >
          <Text style={styles.primaryButtonText}>Calculate</Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (step === "camera" || step === "review") {
    return (
      <SafeAreaView edges={[]} style={styles.cameraContainer}>
        <ScanCameraView
          flashEnabled={flashEnabled}
          isAnalyzing={isAnalyzing}
          previewPhotoUri={previewPhotoUri || scan.capturedPhotoUri}
          sheetContent={step === "review" ? reviewSheet : undefined}
          scanCount={scan.scanCount}
          onToggleFlash={() => setFlashEnabled((enabled) => !enabled)}
          onCapturePhoto={startReviewWithPhoto}
          onBarcodeScanned={startReviewWithBarcode}
          onResetPreview={resetPreview}
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
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  sheetHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  sheetSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  aiBadge: {
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    borderRadius: 16,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  aiBadgeText: {
    color: "#0071E3",
    fontSize: 12,
    fontWeight: "900",
  },
  foodList: {
    gap: 10,
  },
  inputBlock: {
    marginTop: 18,
  },
  inputLabel: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 9,
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    fontSize: 15,
    minHeight: 88,
    padding: 13,
    textAlignVertical: "top",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 54,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0071E3",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 54,
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
