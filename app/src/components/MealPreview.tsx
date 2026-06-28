import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";

type MealPreviewProps = {
  scanCount: number;
  compact?: boolean;
  imageUri?: string;
};

const MealPreview = ({ scanCount, compact = false, imageUri }: MealPreviewProps) => {
  return (
    <View style={[styles.previewShell, compact && styles.previewShellCompact]}>
      <View style={styles.previewCamera}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.tableSurface}>
            <View style={styles.plate}>
              <View style={styles.ricePatch} />
              <View style={styles.proteinPatch} />
              <View style={styles.greensPatch} />
            </View>
            <View style={styles.cup} />
          </View>
        )}

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
            {imageUri
              ? "Meal photo ready"
              : scanCount > 0
                ? "Scanned item ready"
                : "Awaiting scan"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MealPreview;

const styles = StyleSheet.create({
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
  previewCamera: {
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
  photoPreview: {
    height: "100%",
    width: "100%",
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
});
