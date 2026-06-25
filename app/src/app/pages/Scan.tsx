import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Beef,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Flame,
  Image,
  Minus,
  Plus,
  RefreshCcw,
  Salad,
  Sparkles,
  Trash2,
  Utensils,
  Zap,
  ZapOff,
} from "lucide-react-native";

type ScanStep = "camera" | "review" | "summary";
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type DetectedFood = {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
};

const initialDetectedFoods: DetectedFood[] = [
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

const mealTypes: { label: string; value: MealType }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

const Scan = () => {
  const [step, setStep] = useState<ScanStep>("camera");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [foods, setFoods] = useState(initialDetectedFoods);
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
        if (food.id !== id) {
          return food;
        }

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
    setFoods((currentFoods) =>
      currentFoods.filter((food) => food.id !== id)
    );
  };

  const startReview = () => {
    setScanCount((count) => count + 1);
    setStep("review");
  };

  const resetScan = () => {
    setFoods(initialDetectedFoods);
    setMissingFoodText("");
    setMealType("lunch");
    setStep("camera");
  };

  if (step === "review") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              accessibilityLabel="Back to scan camera"
              onPress={() => setStep("camera")}
              style={styles.iconButton}
            >
              <ArrowLeft size={22} color="#111827" />
            </TouchableOpacity>
            <View style={styles.titleBlockCentered}>
              <Text style={styles.screenTitle}>Review Meal</Text>
              <Text style={styles.screenSubtitle}>
                Adjust the mock detection before calculating.
              </Text>
            </View>
            <View style={styles.iconButtonGhost} />
          </View>

          <MealPreview scanCount={scanCount} compact />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Detected Foods</Text>
            <View style={styles.aiBadge}>
              <Sparkles size={14} color="#0071E3" />
              <Text style={styles.aiBadgeText}>Mock AI</Text>
            </View>
          </View>

          <View style={styles.foodList}>
            {foods.map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodIcon}>
                  {food.id === "salad" ? (
                    <Salad size={22} color="#1F8A5B" />
                  ) : food.id === "chicken" ? (
                    <Beef size={22} color="#A44720" />
                  ) : (
                    <Utensils size={22} color="#0071E3" />
                  )}
                </View>
                <View style={styles.foodContent}>
                  <View style={styles.foodTitleRow}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.confidence}>{food.confidence}%</Text>
                  </View>
                  <Text style={styles.foodMeta}>
                    {food.calories} kcal • {food.protein}g protein
                  </Text>
                  <View style={styles.portionRow}>
                    <TouchableOpacity
                      accessibilityLabel={`Decrease ${food.name} portion`}
                      onPress={() => updatePortion(food.id, "down")}
                      style={styles.stepperButton}
                    >
                      <Minus size={16} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.gramsText}>{food.grams}g</Text>
                    <TouchableOpacity
                      accessibilityLabel={`Increase ${food.name} portion`}
                      onPress={() => updatePortion(food.id, "up")}
                      style={styles.stepperButton}
                    >
                      <Plus size={16} color="#111827" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  accessibilityLabel={`Remove ${food.name}`}
                  onPress={() => removeFood(food.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Anything missing?</Text>
            <TextInput
              multiline
              placeholder="Example: one Coke and two boiled eggs"
              placeholderTextColor="#9CA3AF"
              onChangeText={setMissingFoodText}
              value={missingFoodText}
              style={styles.textArea}
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={resetScan} style={styles.secondaryButton}>
              <RefreshCcw size={18} color="#111827" />
              <Text style={styles.secondaryButtonText}>Re-scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={foods.length === 0}
              onPress={() => setStep("summary")}
              style={[
                styles.primaryButton,
                foods.length === 0 && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>Calculate</Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === "summary") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              accessibilityLabel="Back to meal review"
              onPress={() => setStep("review")}
              style={styles.iconButton}
            >
              <ArrowLeft size={22} color="#111827" />
            </TouchableOpacity>
            <View style={styles.titleBlockCentered}>
              <Text style={styles.screenTitle}>Meal Summary</Text>
              <Text style={styles.screenSubtitle}>
                Ready to save when the backend is connected.
              </Text>
            </View>
            <View style={styles.iconButtonGhost} />
          </View>

          <MealPreview scanCount={scanCount} compact />

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}>
                <Flame size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.summaryEyebrow}>Total Calories</Text>
                <Text style={styles.caloriesTotal}>{totals.calories} kcal</Text>
              </View>
            </View>

            <View style={styles.macroGrid}>
              <MacroTile label="Protein" value={`${totals.protein}g`} />
              <MacroTile label="Carbs" value={`${totals.carbs}g`} />
              <MacroTile label="Fat" value={`${totals.fat}g`} />
            </View>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {mealTypes.map((type) => {
                const selected = mealType === type.value;

                return (
                  <Pressable
                    key={type.value}
                    onPress={() => setMealType(type.value)}
                    style={[
                      styles.mealTypeButton,
                      selected && styles.mealTypeButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.mealTypeText,
                        selected && styles.mealTypeTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                    {selected && <Check size={16} color="#0071E3" />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {missingFoodText.trim().length > 0 && (
            <View style={styles.noteCard}>
              <Text style={styles.noteLabel}>User correction</Text>
              <Text style={styles.noteText}>{missingFoodText}</Text>
            </View>
          )}

          <TouchableOpacity onPress={resetScan} style={styles.saveButton}>
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Meal</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraScreen}>
        <View style={styles.cameraHeader}>
          <View>
            <Text style={styles.screenTitle}>Scan Meal</Text>
            <Text style={styles.screenSubtitle}>
              Take a photo to estimate calories
            </Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Toggle camera flash"
            onPress={() => setFlashEnabled((enabled) => !enabled)}
            style={styles.iconButton}
          >
            {flashEnabled ? (
              <Zap size={22} color="#0071E3" />
            ) : (
              <ZapOff size={22} color="#111827" />
            )}
          </TouchableOpacity>
        </View>

        <MealPreview scanCount={scanCount} />

        <View style={styles.cameraTips}>
          <Text style={styles.tipTitle}>Place the meal inside the frame</Text>
          <Text style={styles.tipCopy}>
            Include the full plate and keep sauces or drinks visible.
          </Text>
        </View>

        <View style={styles.captureDock}>
          <TouchableOpacity onPress={startReview} style={styles.galleryButton}>
            <Image size={22} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Capture meal photo"
            onPress={startReview}
            style={styles.shutterOuter}
          >
            <View style={styles.shutterInner}>
              <Camera size={30} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScanCount(0)} style={styles.recentButton}>
            <Circle size={22} color="#0071E3" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const MealPreview = ({
  scanCount,
  compact = false,
}: {
  scanCount: number;
  compact?: boolean;
}) => {
  return (
    <View style={[styles.previewShell, compact && styles.previewShellCompact]}>
      <View style={styles.mockCamera}>
        <View style={styles.tableSurface}>
          <View style={styles.plate}>
            <View style={styles.ricePatch} />
            <View style={styles.proteinPatch} />
            <View style={styles.greensPatch} />
          </View>
          <View style={styles.cup} />
        </View>
        {!compact && (
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
        )}
        <View style={styles.previewPill}>
          <Sparkles size={14} color="#FFFFFF" />
          <Text style={styles.previewPillText}>
            {scanCount > 0 ? "Meal photo ready" : "Live preview mock"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MacroTile = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.macroTile}>
    <Text style={styles.macroValue}>{value}</Text>
    <Text style={styles.macroLabel}>{label}</Text>
  </View>
);

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  cameraScreen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 102,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 116,
  },
  cameraHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingTop: 12,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingTop: 12,
  },
  titleBlockCentered: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
  },
  screenTitle: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "800",
  },
  screenSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  iconButtonGhost: {
    height: 50,
    width: 50,
  },
  previewShell: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    shadowColor: "#111827",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  previewShellCompact: {
    marginBottom: 22,
  },
  mockCamera: {
    aspectRatio: 0.78,
    backgroundColor: "#111827",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableSurface: {
    alignItems: "center",
    backgroundColor: "#D9E7DF",
    flex: 1,
    justifyContent: "center",
  },
  plate: {
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderColor: "#E5E7EB",
    borderRadius: 125,
    borderWidth: 10,
    height: 250,
    justifyContent: "center",
    shadowColor: "#111827",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    width: 250,
  },
  ricePatch: {
    backgroundColor: "#F6E7B7",
    borderRadius: 65,
    height: 118,
    left: 32,
    position: "absolute",
    top: 46,
    width: 118,
  },
  proteinPatch: {
    backgroundColor: "#B95E33",
    borderRadius: 48,
    height: 96,
    position: "absolute",
    right: 42,
    top: 88,
    transform: [{ rotate: "-18deg" }],
    width: 86,
  },
  greensPatch: {
    backgroundColor: "#4EAF75",
    borderRadius: 55,
    bottom: 36,
    height: 96,
    left: 54,
    position: "absolute",
    width: 126,
  },
  cup: {
    backgroundColor: "#CDEBFF",
    borderColor: "#FFFFFF",
    borderRadius: 36,
    borderWidth: 8,
    height: 72,
    position: "absolute",
    right: 34,
    top: 36,
    width: 72,
  },
  scanFrame: {
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 8,
    borderWidth: 1,
    bottom: 74,
    left: 26,
    position: "absolute",
    right: 26,
    top: 74,
  },
  corner: {
    borderColor: "#FFFFFF",
    height: 42,
    position: "absolute",
    width: 42,
  },
  cornerTopLeft: {
    borderLeftWidth: 4,
    borderTopWidth: 4,
    left: -1,
    top: -1,
  },
  cornerTopRight: {
    borderRightWidth: 4,
    borderTopWidth: 4,
    right: -1,
    top: -1,
  },
  cornerBottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: -1,
    left: -1,
  },
  cornerBottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: -1,
    right: -1,
  },
  previewPill: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.76)",
    borderRadius: 18,
    flexDirection: "row",
    gap: 6,
    left: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    top: 18,
  },
  previewPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  cameraTips: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  tipTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  tipCopy: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "center",
  },
  captureDock: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 22,
  },
  galleryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  recentButton: {
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  shutterOuter: {
    alignItems: "center",
    backgroundColor: "#D8EAFF",
    borderRadius: 47,
    height: 94,
    justifyContent: "center",
    width: 94,
  },
  shutterInner: {
    alignItems: "center",
    backgroundColor: "#0071E3",
    borderColor: "#FFFFFF",
    borderRadius: 39,
    borderWidth: 4,
    height: 78,
    justifyContent: "center",
    width: 78,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
  },
  aiBadge: {
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    borderRadius: 16,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  aiBadgeText: {
    color: "#0071E3",
    fontSize: 12,
    fontWeight: "800",
  },
  foodList: {
    gap: 12,
  },
  foodCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF0F3",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14,
  },
  foodIcon: {
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  foodContent: {
    flex: 1,
  },
  foodTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  foodName: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  confidence: {
    color: "#0071E3",
    fontSize: 12,
    fontWeight: "800",
  },
  foodMeta: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  portionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  stepperButton: {
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  gramsText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
    minWidth: 56,
    textAlign: "center",
  },
  deleteButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginLeft: 8,
    width: 34,
  },
  inputBlock: {
    marginTop: 22,
  },
  inputLabel: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    fontSize: 15,
    minHeight: 104,
    padding: 14,
    textAlignVertical: "top",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
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
    height: 56,
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
    height: 56,
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 18,
  },
  summaryHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: "#0071E3",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  summaryEyebrow: {
    color: "#B8C2D1",
    fontSize: 13,
    fontWeight: "700",
  },
  caloriesTotal: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 2,
  },
  macroGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  macroTile: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    flex: 1,
    padding: 12,
  },
  macroValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  macroLabel: {
    color: "#B8C2D1",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  mealTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  mealTypeButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  mealTypeButtonSelected: {
    backgroundColor: "#EAF4FF",
    borderColor: "#0071E3",
  },
  mealTypeText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "800",
  },
  mealTypeTextSelected: {
    color: "#0071E3",
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    padding: 14,
  },
  noteLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  noteText: {
    color: "#111827",
    fontSize: 15,
    lineHeight: 21,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#0071E3",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    height: 58,
    justifyContent: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
