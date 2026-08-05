import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, ChevronRight, RefreshCcw, Sparkles } from "lucide-react-native";
import MealPreview from "./MealPreview";
import DetectedFoodCard from "./DetectedFoodCard";
import { DetectedFood } from "../types/scan";

type ScanReviewViewProps = {
  foods: DetectedFood[];
  imageUri?: string;
  missingFoodText: string;
  scanCount: number;
  onBack: () => void;
  onReset: () => void;
  onChangeMissingFood: (text: string) => void;
  onIncreasePortion: (id: string) => void;
  onDecreasePortion: (id: string) => void;
  onRemoveFood: (id: string) => void;
  onCalculate: () => void;
};

const ScanReviewView = ({
  foods,
  imageUri,
  missingFoodText,
  scanCount,
  onBack,
  onReset,
  onChangeMissingFood,
  onIncreasePortion,
  onDecreasePortion,
  onRemoveFood,
  onCalculate,
}: ScanReviewViewProps) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          accessibilityLabel="Back to scan camera"
          onPress={onBack}
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.titleBlockCentered}>
          <Text style={styles.screenTitle}>Review Meal</Text>
          <Text style={styles.screenSubtitle}>
            Adjust the store results before calculating.
          </Text>
        </View>

        <View style={styles.iconButtonGhost} />
      </View>

      <MealPreview imageUri={imageUri} scanCount={scanCount} compact />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Detected Foods</Text>
        <View style={styles.aiBadge}>
          <Sparkles size={14} color="#0071E3" />
          <Text style={styles.aiBadgeText}>Store data</Text>
        </View>
      </View>

      <View style={styles.foodList}>
        {foods.map((food) => (
          <DetectedFoodCard
            key={food.id}
            food={food}
            onDecrease={() => onDecreasePortion(food.id)}
            onIncrease={() => onIncreasePortion(food.id)}
            onRemove={() => onRemoveFood(food.id)}
          />
        ))}
      </View>

      <View style={styles.inputBlock}>
        <Text style={styles.inputLabel}>Anything missing?</Text>
        <TextInput
          multiline
          placeholder="Example: one Coke and two boiled eggs"
          placeholderTextColor="#9CA3AF"
          onChangeText={onChangeMissingFood}
          value={missingFoodText}
          style={styles.textArea}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={onReset} style={styles.secondaryButton}>
          <RefreshCcw size={18} color="#111827" />
          <Text style={styles.secondaryButtonText}>Re-scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={foods.length === 0}
          onPress={onCalculate}
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
  );
};

export default ScanReviewView;

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
});
