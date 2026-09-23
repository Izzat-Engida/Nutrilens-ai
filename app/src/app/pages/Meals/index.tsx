import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LucideIcon, Cookie, Moon, Sun, Coffee, ChevronRight, Sparkles, Plus, Trash2 } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useGetMealsQuery, useDeleteMealMutation } from '@/store/meals/mealsApi'
import { firstFoodName, firstPortion, mealCalories } from '@/store/utils/meals'
import { formatClock, isoDate } from '@/store/utils/dates'
import type { MealType } from '@/types/scan'

const mealTypeMeta: Record<MealType, { label: string; icon: LucideIcon }> = {
  breakfast: { label: 'Breakfast', icon: Coffee },
  lunch: { label: 'Lunch', icon: Sun },
  dinner: { label: 'Dinner', icon: Moon },
  snack: { label: 'Snacks', icon: Cookie },
}

const Meals = () => {
  const router = useRouter()
  const { data: meals = [], isLoading } = useGetMealsQuery({ date: isoDate() })
  const [deleteMeal] = useDeleteMealMutation()
  const totalCalories = meals.reduce((sum, meal) => sum + mealCalories(meal), 0)
  const groupOrder: MealType[] = []
  const grouped: Record<string, typeof meals> = {}

  meals.forEach((meal) => {
    if (!grouped[meal.meal_type]) {
      grouped[meal.meal_type] = []
      groupOrder.push(meal.meal_type)
    }
    grouped[meal.meal_type].push(meal)
  })

  const confirmDelete = (id: number, name: string) => {
    Alert.alert('Delete meal', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void deleteMeal(id) },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.dayLabel}>Today</Text>
            <Text style={styles.sheetTitle}>Meals</Text>
          </View>
          <View style={styles.totalBlock}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {totalCalories.toLocaleString()} <Text style={styles.kcalUnit}>kcal</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/pages/Meals/log' as any)}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>Log a meal</Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator color="#0071E3" style={{ marginVertical: 20 }} />}

        {!isLoading && groupOrder.length === 0 && (
          <Text style={styles.empty}>No meals yet. Scan a plate or log one manually.</Text>
        )}

        {groupOrder.map((type) => {
          const sectionMeals = grouped[type]
          const sectionTotal = sectionMeals.reduce((sum, meal) => sum + mealCalories(meal), 0)
          const meta = mealTypeMeta[type]
          const SectionIcon = meta.icon
          const sectionTime = formatClock(sectionMeals[0]?.consumed_at)

          return (
            <View key={type} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionIconCircle}>
                    <SectionIcon size={20} color="#0066CC" />
                  </View>
                  <View>
                    <Text style={styles.sectionTitle}>{meta.label}</Text>
                    <Text style={styles.sectionTime}>{sectionTime}</Text>
                  </View>
                </View>
                <Text style={styles.sectionTotal}>{sectionTotal} kcal</Text>
              </View>

              {sectionMeals.map((meal) => (
                <View key={meal.id} style={styles.foodCard}>
                  <View style={styles.foodCardLeft}>
                    <View style={styles.foodIconCircle}>
                      <SectionIcon size={22} color="#0066CC" />
                    </View>
                    <View>
                      <Text style={styles.foodName}>{firstFoodName(meal)}</Text>
                      <Text style={styles.foodPortion}>{firstPortion(meal)}</Text>
                    </View>
                  </View>
                  <View style={styles.foodCardRight}>
                    <Text style={styles.foodCalories}>
                      {mealCalories(meal)} <Text style={styles.kcalUnit}>kcal</Text>
                    </Text>
                    <TouchableOpacity onPress={() => confirmDelete(meal.id, firstFoodName(meal))}>
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )
        })}

        <TouchableOpacity style={styles.recommendCard} onPress={() => router.push('/pages/Meals/recommendation')}>
          <View style={styles.recommendIcon}>
            <Sparkles color="#fff" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recommendTitle}>AI meal recommendations</Text>
            <Text style={styles.recommendSubtitle}>Tailored to your remaining macros</Text>
          </View>
          <ChevronRight color="gray" size={20} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Meals

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayLabel: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  sheetTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#0066CC',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  totalValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  kcalUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#0071E3',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  empty: {
    color: '#6B7280',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F0FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTime: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTotal: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  foodCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  foodCardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  foodIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  foodPortion: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  foodCalories: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  recommendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0071E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  recommendSubtitle: {
    color: '#9CA3AF',
    marginTop: 2,
  },
})
