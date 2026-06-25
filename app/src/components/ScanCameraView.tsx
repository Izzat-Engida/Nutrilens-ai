import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera, Image, Circle, Zap, ZapOff } from "lucide-react-native";
import MealPreview from "./MealPreview";

type ScanCameraViewProps = {
  flashEnabled: boolean;
  scanCount: number;
  onToggleFlash: () => void;
  onStartReview: () => void;
  onResetPreview: () => void;
};

const ScanCameraView = ({
  flashEnabled,
  scanCount,
  onToggleFlash,
  onStartReview,
  onResetPreview,
}: ScanCameraViewProps) => {
  return (
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
          onPress={onToggleFlash}
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
        <TouchableOpacity onPress={onStartReview} style={styles.galleryButton}>
          <Image size={22} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Capture meal photo"
          onPress={onStartReview}
          style={styles.shutterOuter}
        >
          <View style={styles.shutterInner}>
            <Camera size={30} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onResetPreview} style={styles.recentButton}>
          <Circle size={22} color="#0071E3" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScanCameraView;

const styles = StyleSheet.create({
  cameraScreen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 102,
  },
  cameraHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingTop: 12,
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
});