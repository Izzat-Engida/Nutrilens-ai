import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { MealType, mealTypes } from "../types/scan";

type MealTypeSelectorProps = {
  mealType: MealType;
  onSelect: (mealType: MealType) => void;
};

const MealTypeSelector = ({
  mealType,
  onSelect,
}: MealTypeSelectorProps) => {
  return (
    <View style={styles.mealTypeGrid}>
      {mealTypes.map((type) => {
        const selected = mealType === type.value;

        return (
          <Pressable
            key={type.value}
            onPress={() => onSelect(type.value)}
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
  );
};

export default MealTypeSelector;

const styles = StyleSheet.create({
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
});