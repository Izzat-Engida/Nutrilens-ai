import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRequestPasswordResetMutation } from '@/store/auth/authApi';

export default function ForgotPassword() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const submit = async () => { try { await requestReset({ email }).unwrap(); Alert.alert('Check your inbox', 'If an account exists for this email, a reset link has been sent.'); router.back(); } catch { Alert.alert('Request failed', 'Enter a valid email and try again.'); } };
  return <SafeAreaView style={styles.container}><View style={styles.content}><Text style={styles.title}>Forgot password?</Text><Text style={styles.subtitle}>Enter your email and we’ll send you a reset link.</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" /><TouchableOpacity style={styles.button} onPress={() => void submit()} disabled={isLoading}><Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send reset link'}</Text></TouchableOpacity><TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back to sign in</Text></TouchableOpacity></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, content: { padding: 24, paddingTop: 80 }, title: { fontSize: 32, fontWeight: '900', color: '#111827' }, subtitle: { color: '#6B7280', fontSize: 16, lineHeight: 23, marginTop: 8, marginBottom: 26 }, input: { height: 52, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 15 }, button: { backgroundColor: '#0071E3', borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 18 }, buttonText: { color: '#fff', fontWeight: '800' }, back: { color: '#0071E3', textAlign: 'center', marginTop: 22, fontWeight: '700' } });
