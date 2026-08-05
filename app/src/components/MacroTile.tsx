import React from "react";
import { StyleSheet, Text, View } from "react-native";

type MacroTileProps = {
  label: string;
  value: string;
};

const MacroTile = ({ label, value }: MacroTileProps) => {
  return (
    <View style={styles.macroTile}>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
};

export default MacroTile;

const styles = StyleSheet.create({
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
});