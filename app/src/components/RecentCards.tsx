import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Apple, Beef, Drumstick, Pizza } from 'lucide-react-native'
import { useRouter } from 'expo-router'

type MealIcon = 'apple' | 'beef' | 'drumstick' | 'pizza'

interface RecentCardsItem {
  icon: MealIcon
  foodName: string
  calories: number
  time: string
}

interface RecentCardsProps {
  data: RecentCardsItem[]
}

const RecentCards = ({ data }: RecentCardsProps) => {
  const router = useRouter()
  const icons: Record<MealIcon, React.ComponentType<any>> = {
    apple: Apple,
    beef: Beef,
    drumstick: Drumstick,
    pizza: Pizza,
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Recent meals</Text>
        <Pressable onPress={() => router.push('/pages/Meals')}>
          <Text style={{ color: '#0066CC', fontSize: 15, fontWeight: 'bold' }}>See all</Text>
        </Pressable>
      </View>
      {data.length === 0 ? (
        <Text style={styles.empty}>No meals logged yet today.</Text>
      ) : (
        data.map((item, index) => {
          const IconComponent = icons[item.icon] ?? Drumstick
          return (
            <View
              key={`${item.foodName}-${index}`}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                borderRadius: 20,
                margin: 5,
                padding: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.01,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#f5f5f7' }}>
                  <IconComponent size={30} color="#0066CC" />
                </View>
                <View>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>{item.foodName}</Text>
                  <Text>{item.time}</Text>
                </View>
              </View>
              <View>
                <Text>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>{item.calories} </Text>
                  kcal
                </Text>
              </View>
            </View>
          )
        })
      )}
    </View>
  )
}

export default RecentCards
const styles = StyleSheet.create({
  empty: {
    color: '#6B7280',
    marginHorizontal: 20,
    marginTop: 12,
  },
})
