import { useRouter } from 'expo-router'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useLazyGetProfileQuery } from '@/store/onboarding/profileApi'

const index = () => {
  const router = useRouter()
  const { accessToken, isRestoring } = useSelector((state: RootState) => state.auth)
  const [getProfile] = useLazyGetProfileQuery()
  const checkedToken = useRef<string | null | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isRestoring || checkedToken.current === accessToken) return

    if (!accessToken) {
      checkedToken.current = null
      router.replace('/(onboarding)/Welcome')
      return
    }

    checkedToken.current = accessToken
    let active = true
    void getProfile().unwrap().then(() => {
      if (active) router.replace('/pages/Home')
    }).catch((error: unknown) => {
      if (!active) return
      const status = typeof error === 'object' && error !== null && 'status' in error
        ? error.status
        : undefined
      if (status === 404) {
        router.replace('/(onboarding)/Goals')
      } else if (status === 401) {
        router.replace('/(onboarding)/Welcome')
      } else {
        setErrorMessage('We could not load your profile. Please try again.')
      }
    })

    return () => {
      active = false
    }
  }, [accessToken, getProfile, isRestoring, router])

  if (errorMessage) {
    return <View style={styles.container}><Text style={styles.errorText}>{errorMessage}</Text></View>
  }

  return <View style={styles.container}><ActivityIndicator size="large" color="#0071E3" /></View>
}

export default index

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  errorText: { color: '#B42318', fontSize: 16, textAlign: 'center', paddingHorizontal: 24 },
})
