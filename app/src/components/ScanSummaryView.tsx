import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft, Check, Flame } from "lucide-react-native";
import MealPreview from "./MealPreview";
import MacroTile from "./MacroTile";
import MealTypeSelector from "./MealTypeSelector";
import { MealType } from "../types/scan";

type Totals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type ScanSummaryViewProps = {
  totals: Totals;
  imageUri?: string;
  scanCount: number;
  mealType: MealType;
  missingFoodText: string;
  onBack: () => void;
  onSelectMealType: (mealType: MealType) => void;
  onSave: () => void;
};

const ScanSummaryView = ({
  totals,
  imageUri,
  scanCount,
  mealType,
  missingFoodText,
  onBack,
  onSelectMealType,
  onSave,
}: ScanSummaryViewProps) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          accessibilityLabel="Back to meal review"
          onPress={onBack}
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.titleBlockCentered}>
          <Text style={styles.screenTitle}>Meal Summary</Text>
          <Text style={styles.screenSubtitle}>
            Save this meal to today's store data.
          </Text>
        </View>

        <View style={styles.iconButtonGhost} />
      </View>

      <MealPreview imageUri={imageUri} scanCount={scanCount} compact />

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
        <MealTypeSelector mealType={mealType} onSelect={onSelectMealType} />
      </View>

      {missingFoodText.trim().length > 0 && (
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>User correction</Text>
          <Text style={styles.noteText}>{missingFoodText}</Text>
        </View>
      )}

      <TouchableOpacity onPress={onSave} style={styles.saveButton}>
        <Check size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save Meal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScanSummaryView;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 116,
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
    textAlign: "center",
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
  inputBlock: {
    marginTop: 22,
  },
  inputLabel: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
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
