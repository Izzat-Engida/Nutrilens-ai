import { View, Text ,StyleSheet, ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalorieHome from '@/components/CalorieHome'
import BentoCards from '@/components/BetnoCards'
const Home = () => {
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        
        <CalorieHome/>
        <BentoCards/>
      </ScrollView>

    </SafeAreaView>
  )
}

export default Home
const style=StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'#f5f5f7'
}
})