import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const WeightCard = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const data = [
    {
      value: 73.4,
      date: "Aug 1",
      label: "",
      dataPointText: "73.4",
    },
    {
      value: 73.0,
      date: "Aug 8",
      label: "",
      dataPointText: "73.0",
    },
    {
      value: 72.6,
      date: "Aug 15",
      label: "",
      dataPointText: "72.6",
    },
    {
      value: 72.0,
      date: "Aug 22",
      label: "",
      dataPointText: "72.0",
    },
  ];

  return (
    <View style={styles.weightCard}>
      <Text style={styles.weightTitle}>Weight</Text>

      <Text style={styles.value}>72.0 kg</Text>

      <Text style={styles.sub}>↘ 1.4 kg this month</Text>

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
        thickness={4}
        color="#0066CC"
        startFillColor="#0066CC"
        endFillColor="#0066CC"
        startOpacity={0.35}
        endOpacity={0.03}
        hideRules
        hideYAxisText
        hideAxesAndRules
        hideDataPoints={false}
        dataPointsColor="#0066CC"
        dataPointsRadius={6}
        data={data}
        initialSpacing={10}
        endSpacing={10}
        yAxisThickness={0}
        xAxisThickness={0}
        hideOrigin
        noOfSections={4}
        onPress={(item) => {
          setSelectedPoint(item);
        }}
      />
    </View>
  );
};

export default WeightCard;

const styles = StyleSheet.create({
  weightCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
  },

  weightTitle: {
    fontSize: 16,
    color: "gray",
  },

  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  sub: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
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