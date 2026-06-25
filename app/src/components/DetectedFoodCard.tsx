import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Beef, Minus, Plus, Salad, Trash2, Utensils } from "lucide-react-native";
import { DetectedFood } from "../types/scan";

type DetectedFoodCardProps = {
  food: DetectedFood;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

const DetectedFoodCard = ({
  food,
  onDecrease,
  onIncrease,
  onRemove,
}: DetectedFoodCardProps) => {
  return (
    <View style={styles.foodCard}>
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
            onPress={onDecrease}
            style={styles.stepperButton}
          >
            <Minus size={16} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.gramsText}>{food.grams}g</Text>

          <TouchableOpacity
            accessibilityLabel={`Increase ${food.name} portion`}
            onPress={onIncrease}
            style={styles.stepperButton}
          >
            <Plus size={16} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        accessibilityLabel={`Remove ${food.name}`}
        onPress={onRemove}
        style={styles.deleteButton}
      >
        <Trash2 size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

export default DetectedFoodCard;

const styles = StyleSheet.create({
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
});