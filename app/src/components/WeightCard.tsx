import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useNutritionStore, WeightPoint } from "@/store/nutritionStore";

const WeightCard = () => {
  const [selectedPoint, setSelectedPoint] = useState<WeightPoint | null>(null);
  const data = useNutritionStore((state) => state.weightProgress);
  const currentWeightKg = useNutritionStore((state) => state.currentWeightKg);

  return (
    <View style={styles.weightCard}>
      <Text style={styles.weightTitle}>Weight</Text>

      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
  <Text style={styles.value}>{currentWeightKg.toFixed(1)}</Text>
  <Text style={styles.unit}> kg</Text>
</View>

      {selectedPoint && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipWeight}>
            {selectedPoint.value} kg
          </Text>

          <Text style={styles.tooltipDate}>
            {selectedPoint.date}
          </Text>
        </View>
      )}

      <LineChart
  areaChart
  curved
  height={90}
  width={220}
  thickness={3}
  color="#2563EB"
  startFillColor="#2563EB"
  endFillColor="#2563EB"
  startOpacity={0.15}
  endOpacity={0.01}
  hideDataPoints
  hideRules
  hideAxesAndRules
  hideYAxisText
  yAxisThickness={0}
  xAxisThickness={0}
  data={data}
  maxValue={150}
  
/>
    </View>
  );
};

export default WeightCard;

const styles = StyleSheet.create({
 weightCard: {
  width: "66%",
  backgroundColor: "#fff",
  borderRadius: 24,
  padding: 20,
  height: 240,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
},
weightTitle: {
  fontSize: 14,
  color: "#6B7280",
  letterSpacing: 1,
  marginBottom: 12,
},

 value: {
  fontSize: 25,
  fontWeight: "700",
  color: "#111827",
},
  sub: {
    fontSize: 14,
    color: "gray",
    marginBottom: 30,
  },
  unit: {
  fontSize: 20,
  color: "#4B5563",
},

  tooltip: {
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },

  tooltipWeight: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  tooltipDate: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
});
