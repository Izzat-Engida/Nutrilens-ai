import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { Camera, RefreshCcw, ScanLine, X, Zap, ZapOff } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_SNAP_HALF = 0.5;
const SHEET_SNAP_FULL = 0.9;
const SHEET_MIN_FRACTION = 0.22;
const DISMISS_DRAG_FRACTION = 0.26; 
const DISMISS_VELOCITY = 1.2; 

type ScanCameraViewProps = {
  flashEnabled: boolean;
  isAnalyzing?: boolean;
  previewPhotoUri?: string;
  sheetContent?: ReactNode;
  scanCount: number;
  onToggleFlash: () => void;
  onCapturePhoto: (photoUri: string) => void;
  onBarcodeScanned: (barcode: string) => void;
  onResetPreview: () => void;
};

const ScanCameraView = ({
  flashEnabled,
  isAnalyzing = false,
  previewPhotoUri,
  sheetContent,
  scanCount,
  onToggleFlash,
  onCapturePhoto,
  onBarcodeScanned,
  onResetPreview,
}: ScanCameraViewProps) => {
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const shimmer = useRef(new Animated.Value(0.35)).current;
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [barcodeLocked, setBarcodeLocked] = useState(false);
  const hasSheet = isAnalyzing || Boolean(sheetContent);

  const sheetHeightAnim = useRef(new Animated.Value(SCREEN_HEIGHT * SHEET_SNAP_HALF)).current;
  const currentSnapRef = useRef(SHEET_SNAP_HALF);
  const dragStartHeightRef = useRef(SCREEN_HEIGHT * SHEET_SNAP_HALF);

  useEffect(() => {
    if (!hasSheet) return;

    currentSnapRef.current = SHEET_SNAP_HALF;
    sheetHeightAnim.setValue(SCREEN_HEIGHT * SHEET_SNAP_HALF);
  }, [hasSheet, sheetHeightAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        dragStartHeightRef.current = SCREEN_HEIGHT * currentSnapRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const nextHeight = dragStartHeightRef.current - gesture.dy;
        const clamped = Math.max(
          SCREEN_HEIGHT * SHEET_MIN_FRACTION,
          Math.min(SCREEN_HEIGHT * SHEET_SNAP_FULL, nextHeight)
        );
        sheetHeightAnim.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        const draggedDownEnough =
          gesture.dy > SCREEN_HEIGHT * DISMISS_DRAG_FRACTION || gesture.vy > DISMISS_VELOCITY;

        if (draggedDownEnough) {
          Animated.timing(sheetHeightAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setBarcodeLocked(false);
            onResetPreview();
          });
          return;
        }

        const endHeight = dragStartHeightRef.current - gesture.dy;
        const midpoint = SCREEN_HEIGHT * ((SHEET_SNAP_HALF + SHEET_SNAP_FULL) / 2);
        const targetSnap = endHeight > midpoint ? SHEET_SNAP_FULL : SHEET_SNAP_HALF;

        currentSnapRef.current = targetSnap;
        Animated.spring(sheetHeightAnim, {
          toValue: SCREEN_HEIGHT * targetSnap,
          useNativeDriver: false,
          bounciness: 4,
        }).start();
      },
    })
  ).current;


  useEffect(() => {
    if (!isAnalyzing) {
      shimmer.stopAnimation();
      shimmer.setValue(0.35);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          duration: 760,
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          duration: 760,
          toValue: 0.35,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isAnalyzing, shimmer]);

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
      <View style={styles.previewShell}>
        {previewPhotoUri ? (
          <Image source={{ uri: previewPhotoUri }} style={styles.cameraPreview} />
        ) : (
          <CameraView
            ref={cameraRef}
            active={!hasSheet}
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
        )}

        <View style={[styles.topOverlay, { top: insets.top + 12 }]}>
          <View style={styles.titlePill}>
            <ScanLine size={16} color="#FFFFFF" />
            <Text style={styles.titlePillText}>Scan meal</Text>
          </View>

          <TouchableOpacity
            accessibilityLabel="Reset scan"
            onPress={() => {
              setBarcodeLocked(false);
              onResetPreview();
            }}
            style={styles.glassButton}
          >
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        {!hasSheet && (
        <View style={styles.guideCopy}>
          <Text style={styles.guideTitle}>Align food in the frame</Text>
          <Text style={styles.guideText}>
            {scanCount > 0 ? "Ready when you want another scan" : "Hold steady for a cleaner estimate"}
          </Text>
        </View>
        )}

        {hasSheet && (
          <Animated.View style={[styles.analysisSheet, { height: sheetHeightAnim }]}>
            <View {...panResponder.panHandlers} style={styles.sheetHandleArea}>
              <View style={styles.sheetHandle} />
            </View>
            {isAnalyzing ? (
              <>
                <Text style={styles.analysisTitle}>Reading your meal</Text>
                <Text style={styles.analysisCopy}>Finding foods, portions, and macros.</Text>

                <View style={styles.skeletonStack}>
                  <Animated.View style={[styles.skeletonHero, { opacity: shimmer }]} />
                  <View style={styles.skeletonRow}>
                    <Animated.View style={[styles.skeletonCircle, { opacity: shimmer }]} />
                    <View style={styles.skeletonLines}>
                      <Animated.View style={[styles.skeletonLineWide, { opacity: shimmer }]} />
                      <Animated.View style={[styles.skeletonLineNarrow, { opacity: shimmer }]} />
                    </View>
                  </View>
                  <View style={styles.skeletonGrid}>
                    <Animated.View style={[styles.skeletonTile, { opacity: shimmer }]} />
                    <Animated.View style={[styles.skeletonTile, { opacity: shimmer }]} />
                    <Animated.View style={[styles.skeletonTile, { opacity: shimmer }]} />
                  </View>
                </View>
              </>
            ) : (
              <ScrollView
                bounces={false}
                contentContainerStyle={styles.sheetScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {sheetContent}
              </ScrollView>
            )}
          </Animated.View>
        )}

      {!hasSheet && (
      <View style={[styles.captureDock, { bottom: Math.max(118, insets.bottom + 98) }]}>
        <TouchableOpacity
          accessibilityLabel="Retake scan"
          disabled={isCapturing || isAnalyzing}
          onPress={() => {
            setBarcodeLocked(false);
            onResetPreview();
          }}
          style={styles.secondaryControl}
        >
          <RefreshCcw size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Capture meal photo"
          disabled={isCapturing || isAnalyzing}
          onPress={capturePhoto}
          style={styles.shutterOuter}
        >
          <View style={styles.shutterInner}>
            {isCapturing ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Camera size={30} color="#111827" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Toggle camera flash"
          disabled={isAnalyzing}
          onPress={onToggleFlash}
          style={styles.secondaryControl}
        >
          {flashEnabled ? (
            <Zap size={22} color="#FFFFFF" />
          ) : (
            <ZapOff size={22} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
      )}
      </View>
    </View>
  );
};

export default ScanCameraView;

const styles = StyleSheet.create({
  cameraScreen: {
    flex: 1,
    backgroundColor: "#000000",
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
  previewShell: {
    flex: 1,
    overflow: "hidden",
  },
  cameraPreview: {
    height: "100%",
    width: "100%",
  },
  topOverlay: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    left: 20,
    position: "absolute",
    right: 20,
    top: 18,
  },
  titlePill: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.42)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  titlePillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  glassButton: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.42)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  scanFrame: {
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 28,
    borderWidth: 1.5,
    height: 360,
    left: 30,
    position: "absolute",
    right: 30,
    top: "21%",
  },
  corner: {
    borderColor: "#FFFFFF",
    height: 48,
    position: "absolute",
    width: 48,
  },
  cornerTopLeft: {
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderTopLeftRadius: 28,
    left: -2,
    top: -2,
  },
  cornerTopRight: {
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderTopRightRadius: 28,
    right: -2,
    top: -2,
  },
  cornerBottomLeft: {
    borderBottomLeftRadius: 28,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    bottom: -2,
    left: -2,
  },
  cornerBottomRight: {
    borderBottomRightRadius: 28,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    bottom: -2,
    right: -2,
  },
  guideCopy: {
    alignItems: "center",
    position: "absolute",
    top: "67%",
    width: "100%",
  },
  guideTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  guideText: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  analysisSheet: {
    backgroundColor: "#F5F5F7",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    paddingBottom: 104,
    paddingHorizontal: 20,
    position: "absolute",
    right: 0,
  },
  sheetScrollContent: {
    paddingBottom: 12,
  },
  sheetHandleArea: {
    alignItems: "center",
    paddingBottom: 14,
    paddingTop: 10,
    width: "100%",
  },
  sheetHandle: {
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    height: 4,
    width: 42,
  },
  analysisTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
  },
  analysisCopy: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  skeletonStack: {
    gap: 14,
    marginTop: 18,
  },
  skeletonHero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 72,
  },
  skeletonRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  skeletonCircle: {
    backgroundColor: "#E5E7EB",
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  skeletonLines: {
    flex: 1,
    gap: 9,
  },
  skeletonLineWide: {
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    height: 10,
    width: "82%",
  },
  skeletonLineNarrow: {
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    height: 10,
    width: "46%",
  },
  skeletonGrid: {
    flexDirection: "row",
    gap: 10,
  },
  skeletonTile: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flex: 1,
    height: 56,
  },
  captureDock: {
    alignItems: "center",
    bottom: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 34,
    position: "absolute",
    right: 34,
  },
  secondaryControl: {
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.42)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  shutterOuter: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 42,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  shutterInner: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 34,
    borderWidth: 3,
    height: 68,
    justifyContent: "center",
    width: 68,
  },
});