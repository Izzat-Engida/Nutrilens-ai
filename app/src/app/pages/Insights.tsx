import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { useGetNutritionHistoryQuery } from '@/store/nutrition/nutritionApi';
import { useGetWeightProgressQuery } from '@/store/tracking/trackingApi';
import { useGenerateRecommendationsMutation, useGetRecommendationsQuery, useMarkRecommendationReadMutation } from '@/store/recommendations/recommendationsApi';

export default function Insights() {
  const { data: recommendations = [], isLoading } = useGetRecommendationsQuery();
  const { data: progress } = useGetWeightProgressQuery();
  const { data: history = [] } = useGetNutritionHistoryQuery();
  const [generate, { isLoading: generating }] = useGenerateRecommendationsMutation();
  const [markRead] = useMarkRecommendationReadMutation();
  const today = history[0];
  return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Insights</Text><Text style={styles.subtitle}>A clearer view of your nutrition and progress.</Text>
    <View style={styles.stats}><View><Text style={styles.statValue}>{progress?.current_weight ?? '--'} kg</Text><Text style={styles.statLabel}>Current weight</Text></View><View><Text style={styles.statValue}>{today?.calories_consumed ?? 0}</Text><Text style={styles.statLabel}>Today’s calories</Text></View></View>
    <TouchableOpacity style={styles.button} onPress={() => void generate()} disabled={generating}><Sparkles size={18} color="#fff" /><Text style={styles.buttonText}>{generating ? 'Generating...' : 'Refresh insights'}</Text></TouchableOpacity>
    {isLoading && <ActivityIndicator color="#0071E3" />}{recommendations.length === 0 && !isLoading && <Text style={styles.empty}>No insights yet. Refresh to generate recommendations.</Text>}
    {recommendations.map((item) => <TouchableOpacity key={item.id} style={[styles.card, item.is_read && styles.read]} onPress={() => void markRead({ id: item.id })}><Text style={styles.priority}>{item.priority.toUpperCase()} · {item.type}</Text><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.message}>{item.message}</Text></TouchableOpacity>)}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f5f5f7' }, content: { padding: 20, paddingBottom: 50 }, title: { fontSize: 30, fontWeight: '900', color: '#111827' }, subtitle: { color: '#6B7280', marginTop: 6, marginBottom: 18 }, stats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 16 }, statValue: { color: '#111827', fontSize: 22, fontWeight: '900' }, statLabel: { color: '#6B7280', marginTop: 4 }, button: { backgroundColor: '#0071E3', borderRadius: 14, height: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 18 }, buttonText: { color: '#fff', fontWeight: '800' }, empty: { color: '#6B7280' }, card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12 }, read: { opacity: 0.6 }, priority: { color: '#0071E3', fontSize: 12, fontWeight: '800', marginBottom: 6 }, cardTitle: { color: '#111827', fontSize: 17, fontWeight: '800', marginBottom: 6 }, message: { color: '#4B5563', lineHeight: 20 } });
