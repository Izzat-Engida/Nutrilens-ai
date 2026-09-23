import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import MealTypeSelector from '@/components/MealTypeSelector'
import { MealType } from '@/types/scan'
import { useCreateMealMutation } from '@/store/meals/mealsApi'
import { toNumber } from '@/store/utils/nutritionEstimate'

const LogMeal = () => {
  const router = useRouter()
  const [createMeal, { isLoading }] = useCreateMealMutation()
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('serving')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('0')
  const [carbs, setCarbs] = useState('0')
  const [fat, setFat] = useState('0')
  const [notes, setNotes] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSave = async () => {
    if (!foodName.trim() || !calories) {
      setErrorMessage('Add a food name and calories.')
      return
    }
    setErrorMessage(null)
    try {
      await createMeal({
        meal_type: mealType,
        notes,
        items: [
          {
            food_name: foodName.trim(),
            quantity: toNumber(quantity) || 1,
            unit: unit.trim() || 'serving',
            calories: toNumber(calories),
            protein: toNumber(protein),
            carbohydrates: toNumber(carbs),
            fat: toNumber(fat),
          },
        ],
      }).unwrap()
      router.back()
    } catch {
      setErrorMessage('We could not save this meal. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Log a meal</Text>
          <Text style={styles.label}>Meal type</Text>
          <MealTypeSelector mealType={mealType} onSelect={setMealType} />
          <Text style={styles.label}>Food</Text>
          <TextInput style={styles.input} value={foodName} onChangeText={setFoodName} placeholder="Grilled chicken" />
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="decimal-pad" />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Unit</Text>
              <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="g" />
            </View>
          </View>
          <Text style={styles.label}>Calories</Text>
          <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="decimal-pad" />
          <View style={styles.row}>
            <View style={styles.third}>
              <Text style={styles.label}>Protein</Text>
              <TextInput style={styles.input} value={protein} onChangeText={setProtein} keyboardType="decimal-pad" />
            </View>
            <View style={styles.third}>
              <Text style={styles.label}>Carbs</Text>
              <TextInput style={styles.input} value={carbs} onChangeText={setCarbs} keyboardType="decimal-pad" />
            </View>
            <View style={styles.third}>
              <Text style={styles.label}>Fat</Text>
              <TextInput style={styles.input} value={fat} onChangeText={setFat} keyboardType="decimal-pad" />
            </View>
          </View>
          <Text style={styles.label}>Notes</Text>
          <TextInput style={[styles.input, styles.notes]} value={notes} onChangeText={setNotes} multiline />
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Saving...' : 'Save meal'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LogMeal

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 16, color: '#111827' },
  label: { marginTop: 16, marginBottom: 8, fontWeight: '700', color: '#374151' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notes: { height: 90, textAlignVertical: 'top', paddingTop: 12 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  third: { flex: 1 },
  error: { color: '#B42318', marginTop: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#0071E3',
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
})
