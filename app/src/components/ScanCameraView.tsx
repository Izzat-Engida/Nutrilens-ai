import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { Camera, Circle, Image as ImageIcon, Zap, ZapOff } from "lucide-react-native";

type ScanCameraViewProps = {
  flashEnabled: boolean;
  scanCount: number;
  onToggleFlash: () => void;
  onCapturePhoto: (photoUri: string) => void;
  onBarcodeScanned: (barcode: string) => void;
  onResetPreview: () => void;
};

const ScanCameraView = ({
  flashEnabled,
  scanCount,
  onToggleFlash,
  onCapturePhoto,
  onBarcodeScanned,
  onResetPreview,
}: ScanCameraViewProps) => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [barcodeLocked, setBarcodeLocked] = useState(false);

  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.75,
        skipProcessing: true,
      });

      if (photo?.uri) {
        onCapturePhoto(photo.uri);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (barcodeLocked || !data) return;

    setBarcodeLocked(true);
    onBarcodeScanned(data);
  };

  if (!permission) {
    return (
      <View style={styles.permissionState}>
        <ActivityIndicator color="#0071E3" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionState}>
        <Text style={styles.permissionTitle}>Camera access is needed</Text>
        <Text style={styles.permissionCopy}>
          Nutrilens needs the camera to scan meals and product barcodes.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <View style={styles.previewShell}>
        <CameraView
          ref={cameraRef}
          active
          animateShutter
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128"],
          }}
          enableTorch={flashEnabled}
          facing="back"
          mode="picture"
          onBarcodeScanned={barcodeLocked ? undefined : handleBarcodeScanned}
          style={styles.cameraPreview}
        />

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <View style={styles.previewPill}>
          <Text style={styles.previewPillText}>
            {scanCount > 0 ? "Last scan ready" : "Live camera"}
          </Text>
        </View>
      </View>

      <View style={styles.cameraTips}>
        <Text style={styles.tipTitle}>Place the meal inside the frame</Text>
        <Text style={styles.tipCopy}>
          Capture a meal photo, or point the camera at a barcode or QR code.
        </Text>
      </View>

      <View style={styles.captureDock}>
        <TouchableOpacity disabled style={styles.galleryButton}>
          <ImageIcon size={22} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Capture meal photo"
          disabled={isCapturing}
          onPress={capturePhoto}
          style={styles.shutterOuter}
        >
          <View style={styles.shutterInner}>
            {isCapturing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Camera size={30} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setBarcodeLocked(false);
            onResetPreview();
          }}
          style={styles.recentButton}
        >
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
  permissionState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  permissionTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  permissionCopy: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  permissionButton: {
    alignItems: "center",
    backgroundColor: "#0071E3",
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 22,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
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
  previewShell: {
    backgroundColor: "#111827",
    borderRadius: 8,
    elevation: 3,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  cameraPreview: {
    aspectRatio: 0.78,
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
});
