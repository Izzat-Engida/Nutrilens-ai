import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNutritionStore } from "@/store/nutritionStore";
import { LucideIcon, Cookie, Moon, Sun, Coffee,ChevronRight,Sparkles } from 'lucide-react-native';

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type MealIcon = LucideIcon | string;

type RecentMeal = {
  id: string;
  icon: MealIcon;
  foodName: string;
  calories: number;
  time: string;
  portion: string;
  type: MealType;
};

const mealTypeMeta: Record<MealType, { label: string; icon: LucideIcon }> = {
  breakfast: { label: "Breakfast", icon: Coffee },
  lunch: { label: "Lunch", icon: Sun },
  dinner: { label: "Dinner", icon: Moon },
  snack: { label: "Snacks", icon: Cookie },
};

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Sun,
  Moon,
  Cookie,
};

const Meals = () => {
  const recentMeals = useNutritionStore((state) => state.recentMeals) ;
  const totalCalories = recentMeals.reduce((sum, meal) => sum + meal.calories, 0);

  const groupOrder: MealType[] = [];
  const grouped: Record<string, RecentMeal[]> = {};

  recentMeals.forEach((meal) => {
    if (!grouped[meal.type]) {
      grouped[meal.type] = [];
      groupOrder.push(meal.type);
    }
    grouped[meal.type].push(meal);
  });

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

        {groupOrder.map((type) => {
          const meals = grouped[type];
          const sectionTotal = meals.reduce((sum, m) => sum + m.calories, 0);
          const meta = mealTypeMeta[type];
          const SectionIcon = meta.icon;
          const sectionTime = meals[0]?.time;

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

              {meals.map((meal) => {
                const FoodIcon = meal.icon;
                return (
                  <View key={meal.id} style={styles.foodCard}>
                    <View style={styles.foodCardLeft}>
                      <View style={styles.foodIconCircle}>
                        <FoodIcon size={22} color="#0066CC" />
                      </View>
                      <View>
                        <Text style={styles.foodName}>{meal.foodName}</Text>
                        <Text style={styles.foodPortion}>{meal.portion}</Text>
                      </View>
                    </View>
                    <Text style={styles.foodCalories}>
                      {meal.calories} <Text style={styles.kcalUnit}>kcal</Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}


      <View>
        <View>
          <Sparkles color={"#fff"} size={20}/>
        </View>

        <View>
        <Text>AI meal recommendations</Text>
        <Text>Tailored to you remaining macros</Text>
        </View>

        <View>
        <ChevronRight color={"gray"} size={20}/>
        </View>
      </View>

      
      </ScrollView>
    </SafeAreaView>
  );
};

export default Meals;

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
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  dayLabel: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  sheetTitle: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "900",
  },
  totalBlock: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: "#0066CC",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  totalValue: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
  },
  kcalUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0FB",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  sectionTime: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionTotal: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  foodCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  foodIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  foodName: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  foodPortion: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  foodCalories: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
});