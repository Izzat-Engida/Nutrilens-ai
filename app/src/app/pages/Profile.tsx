import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, setUser } from '@/store/auth/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/onboarding/profileApi';
import { useUpdateAccountMutation } from '@/store/auth/authApi';
import { clearOnboarding } from '@/store/onboarding/onboardingSlice';

export default function Profile() {
  const router = useRouter(); const dispatch = useAppDispatch(); const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useGetProfileQuery(); const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation(); const [updateAccount, { isLoading: savingAccount }] = useUpdateAccountMutation();
  const [name, setName] = useState(`${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()); const [email, setEmail] = useState(user?.email ?? ''); const [weight, setWeight] = useState('');
  const save = async () => { try { const response = await updateAccount({ full_name: name, email }).unwrap(); const parts = response.user.full_name.trim().split(/\s+/); dispatch(setUser({ id: response.user.id, first_name: parts[0] ?? '', last_name: parts.slice(1).join(' '), email: response.user.email })); if (weight.trim()) await updateProfile({ weight_kg: Number(weight) }).unwrap(); Alert.alert('Saved', 'Your profile has been updated.'); } catch { Alert.alert('Could not save', 'Please check your details and try again.'); } };
  const signOut = () => { dispatch(clearOnboarding()); dispatch(logout()); router.replace('/(auth)/sign-in'); };
  return <SafeAreaView style={styles.container}><View style={styles.content}><Text style={styles.title}>Profile</Text><Text style={styles.subtitle}>Keep your personal details and goals up to date.</Text><Text style={styles.label}>Full name</Text><TextInput style={styles.input} value={name} onChangeText={setName} /><Text style={styles.label}>Email</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /><Text style={styles.label}>Current weight (kg)</Text><TextInput style={styles.input} value={weight || String(profile?.weight_kg ?? '')} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="Optional" /><TouchableOpacity style={styles.button} onPress={() => void save()} disabled={savingProfile || savingAccount}><Text style={styles.buttonText}>{savingProfile || savingAccount ? 'Saving...' : 'Save changes'}</Text></TouchableOpacity><TouchableOpacity style={styles.logout} onPress={signOut}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity></View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f5f5f7' }, content: { padding: 24 }, title: { fontSize: 30, fontWeight: '900', color: '#111827' }, subtitle: { color: '#6B7280', marginTop: 6, marginBottom: 24 }, label: { color: '#374151', fontWeight: '700', marginTop: 16, marginBottom: 8 }, input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', height: 50, paddingHorizontal: 14 }, button: { backgroundColor: '#0071E3', borderRadius: 14, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 28 }, buttonText: { color: '#fff', fontWeight: '800' }, logout: { alignItems: 'center', marginTop: 22 }, logoutText: { color: '#B42318', fontWeight: '800' } });
