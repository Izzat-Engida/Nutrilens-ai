import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalorieHome from '@/components/CalorieHome'
import BentoCards from '@/components/BentoCards'
import RecentCards from '@/components/RecentCards'
import { Sparkles, ArrowRight, Bell } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useAppSelector } from '@/store/hooks'
import { useGetMealsQuery } from '@/store/meals/mealsApi'
import { useGetRecommendationsQuery } from '@/store/recommendations/recommendationsApi'
import { firstFoodName, mealCalories } from '@/store/utils/meals'
import { formatClock, greetingForNow, isoDate, userInitials } from '@/store/utils/dates'

const Home = () => {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const { data: meals = [], isLoading } = useGetMealsQuery({ date: isoDate() })
  const { data: recommendations = [] } = useGetRecommendationsQuery()
  const insight = recommendations.find((item) => !item.is_read) ?? recommendations[0]
  const recentMeals = meals.slice(0, 4).map((meal) => ({
    icon: 'drumstick' as const,
    foodName: firstFoodName(meal),
    calories: mealCalories(meal),
    time: formatClock(meal.consumed_at),
  }))

  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={style.header}>
          <View>
            <Text style={style.greeting}>{greetingForNow()}</Text>
            <Text style={style.name}>{user?.first_name || 'there'}</Text>
          </View>
          <View style={style.rightSection}>
            <TouchableOpacity style={style.bellContainer} onPress={() => router.push('/pages/Insights')}>
              <Bell size={22} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity style={style.avatar} onPress={() => router.push('/pages/Profile')}>
              <Text style={style.avatarText}>{userInitials(user?.first_name, user?.last_name, user?.email)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CalorieHome />
        <BentoCards />
        <TouchableOpacity
          onPress={() => router.push('/pages/Meals/recommendation')}
          style={style.insightCard}
        >
          <View style={style.insightIcon}>
            <Sparkles size={30} color="#0066CC" />
          </View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={style.insightEyebrow}>AI INSIGHT</Text>
            <Text style={style.insightText} numberOfLines={2}>
              {insight?.message ?? 'Generate recommendations to get a personal insight.'}
            </Text>
          </View>
          <ArrowRight size={24} color="#000" />
        </TouchableOpacity>
        {isLoading ? <ActivityIndicator color="#0071E3" /> : <RecentCards data={recentMeals} />}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 6,
  },
  name: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  insightIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc42',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  insightEyebrow: {
    color: '#0066CC',
    fontSize: 12,
    fontWeight: '600',
  },
  insightText: {
    color: 'black',
    fontSize: 16,
  },
})
