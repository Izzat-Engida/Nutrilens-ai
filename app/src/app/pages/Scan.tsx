import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScanCameraView from '@/components/ScanCameraView';
import ScanReviewView from '@/components/ScanReviewView';
import ScanSummaryView from '@/components/ScanSummaryView';
import { useAnalyzeFoodMutation, useConfirmFoodAnalysisMutation } from '@/store/analysis/foodAnalysisApi';
import { useCreateMealMutation } from '@/store/meals/mealsApi';
import type { FoodAnalysis } from '@/store/types';
import type { DetectedFood, MealType, ScanStep } from '@/types/scan';
import { toNumber } from '@/store/utils/nutritionEstimate';

const ScanScreen = () => {
  const [step, setStep] = useState<ScanStep>('camera');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewPhotoUri, setPreviewPhotoUri] = useState<string>();
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [foods, setFoods] = useState<DetectedFood[]>([]);
  const [missingFoodText, setMissingFoodText] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analyzeFood] = useAnalyzeFoodMutation();
  const [confirmFoodAnalysis] = useConfirmFoodAnalysisMutation();
  const [createMeal, { isLoading: isSaving }] = useCreateMealMutation();
  const totals = useMemo(() => foods.reduce((sum, food) => ({ calories: sum.calories + food.calories, protein: sum.protein + food.protein, carbs: sum.carbs + food.carbs, fat: sum.fat + food.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [foods]);
  const resetScan = () => { setStep('camera'); setIsAnalyzing(false); setPreviewPhotoUri(undefined); setAnalysis(null); setFoods([]); setMissingFoodText(''); setErrorMessage(null); };
  const startAnalysis = (uri: string) => {
    setPreviewPhotoUri(uri); setIsAnalyzing(true); setErrorMessage(null);
    void analyzeFood(uri).unwrap().then((result) => {
      const predictions = result.predictions?.length ? result.predictions : [{ label: result.detected_food || 'Detected food', confidence: toNumber(result.confidence) }];
      setAnalysis(result); setFoods(predictions.map((prediction, index) => ({ id: `${result.id}-${index}`, name: prediction.label, grams: 100, calories: 0, protein: 0, carbs: 0, fat: 0, confidence: prediction.confidence })));
      setIsAnalyzing(false); setStep('review');
    }).catch(() => { setIsAnalyzing(false); setErrorMessage('We could not analyze that image. Please try another photo.'); });
  };
  const saveMeal = async () => {
    if (!analysis || foods.length === 0) return;
    try {
      await confirmFoodAnalysis({ id: analysis.id, detected_food: foods[0].name, estimated_portion_grams: foods[0].grams }).unwrap();
      await createMeal({ meal_type: mealType, notes: missingFoodText, items: foods.map((food) => ({ food_name: food.name, quantity: food.grams, unit: 'g', calories: food.calories, protein: food.protein, carbohydrates: food.carbs, fat: food.fat })) }).unwrap();
      resetScan();
    } catch { setErrorMessage('We could not save this meal. Please try again.'); }
  };
  const review = <ScanReviewView foods={foods} imageUri={previewPhotoUri} missingFoodText={missingFoodText} scanCount={1} onBack={() => setStep('camera')} onReset={resetScan} onChangeMissingFood={setMissingFoodText} onIncreasePortion={(id) => setFoods((items) => items.map((food) => food.id === id ? { ...food, grams: food.grams + 25 } : food))} onDecreasePortion={(id) => setFoods((items) => items.map((food) => food.id === id ? { ...food, grams: Math.max(10, food.grams - 25) } : food))} onRemoveFood={(id) => setFoods((items) => items.filter((food) => food.id !== id))} onCalculate={() => setStep('summary')} />;
  if (step === 'camera' || step === 'review') return <SafeAreaView edges={[]} style={styles.cameraContainer}><ScanCameraView flashEnabled={flashEnabled} isAnalyzing={isAnalyzing} previewPhotoUri={previewPhotoUri} sheetContent={step === 'review' ? review : undefined} scanCount={1} onToggleFlash={() => setFlashEnabled((value) => !value)} onCapturePhoto={startAnalysis} onBarcodeScanned={(barcode) => Alert.alert('Barcode detected', `${barcode}\nTake a photo to analyze the meal.`)} onResetPreview={resetScan} />{errorMessage && <Text style={styles.error}>{errorMessage}</Text>}</SafeAreaView>;
  return <SafeAreaView style={styles.container}><ScanSummaryView totals={totals} imageUri={previewPhotoUri} scanCount={1} mealType={mealType} missingFoodText={missingFoodText} onBack={() => setStep('review')} onSelectMealType={setMealType} onSave={() => void saveMeal()} />{isSaving && <ActivityIndicator style={styles.saving} color="#0071E3" />}{errorMessage && <Text style={styles.error}>{errorMessage}</Text>}</SafeAreaView>;
};
export default ScanScreen;
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F5F5F7' }, cameraContainer: { flex: 1, backgroundColor: '#000' }, saving: { position: 'absolute', bottom: 45, alignSelf: 'center' }, error: { color: '#FCA5A5', textAlign: 'center', padding: 10, backgroundColor: '#111827' } });
