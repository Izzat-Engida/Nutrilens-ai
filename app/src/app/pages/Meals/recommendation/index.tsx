import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Sparkles } from 'lucide-react-native'
import {
  useGenerateRecommendationsMutation,
  useGetRecommendationsQuery,
  useMarkRecommendationReadMutation,
} from '@/store/recommendations/recommendationsApi'

const RecommendationScreen = () => {
  const { data = [], isLoading, refetch } = useGetRecommendationsQuery()
  const [generate, { isLoading: isGenerating }] = useGenerateRecommendationsMutation()
  const [markRead] = useMarkRecommendationReadMutation()

  const handleGenerate = async () => {
    await generate().unwrap().catch(() => undefined)
    refetch()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Recommendations</Text>
        <Text style={styles.subtitle}>Generated from your meals, weight, and remaining macros.</Text>
        <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={isGenerating}>
          <Sparkles size={18} color="#fff" />
          <Text style={styles.buttonText}>{isGenerating ? 'Generating...' : 'Refresh insights'}</Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator color="#0071E3" style={{ marginTop: 24 }} />}
        {data.length === 0 && !isLoading && (
          <Text style={styles.empty}>No recommendations yet. Generate a fresh set.</Text>
        )}
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, item.is_read && styles.cardRead]}
            onPress={() => void markRead({ id: item.id, is_read: true })}
          >
            <Text style={styles.priority}>{item.priority.toUpperCase()} · {item.type}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default RecommendationScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 16 },
  button: {
    backgroundColor: '#0071E3',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: '800' },
  empty: { color: '#6B7280' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardRead: { opacity: 0.65 },
  priority: { color: '#0071E3', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 6 },
  message: { color: '#4B5563', lineHeight: 20 },
})
