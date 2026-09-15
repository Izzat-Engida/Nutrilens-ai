import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { clearOnboarding } from '@/store/onboarding/onboardingSlice'
import { logout } from '@/store/auth/authSlice'
const Profile = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(clearOnboarding())
    dispatch(logout())
    router.replace('/(auth)/sign-in')
  }

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  logoutButton: { marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: '#0071E3' },
  logoutText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
})
