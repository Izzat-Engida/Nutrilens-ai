import { View, Text ,StyleSheet, SafeAreaView} from 'react-native'
import React from 'react'
import GoalCard from '@/components/GoalCard'
import AboutYou from '@/components/AboutYou'

const Goals = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AboutYou/>
    </SafeAreaView>
  )
}

export default Goals

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
})