import { View, Text ,StyleSheet, ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalorieHome from '@/components/CalorieHome'
import BentoCards from '@/components/BentoCards'
import RecentCards from '@/components/RecentCards'
import { Sparkles,ArrowRight } from 'lucide-react-native'
import { Bell } from "lucide-react-native";
const Home = () => {
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <View style={style.header}>
          <View>
            <Text style={style.greeting}>Good morning</Text>
            <Text style={style.name}>Alex Chen</Text>
          </View>
          <View style={style.rightSection}>
            <TouchableOpacity style={style.bellContainer}>
          <Bell size={22} color="#222" />
        </TouchableOpacity>
        <View style={style.avatar}>
        <Text style={style.avatarText}>AC</Text>
        </View>
          </View>
        </View>
        <CalorieHome/>
        <BentoCards/>
       <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    margin: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom:30
  }}
>
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0066cc42",
      width: 50,
      height: 50,
      borderRadius: 25,
    }}
  >
    <Sparkles size={30} color="#0066CC" />
  </View>

  <View
    style={{
      flex: 1,
      marginHorizontal: 12,
    }}
  >
    <Text
      style={{
        color: "#0066CC",
        fontSize: 12,
        fontWeight: "600",
      }}
    >
      AI INSIGHT
    </Text>

    <Text
      style={{
        color: "black",
        fontSize: 16,
      }}
      numberOfLines={2}
    >
      Add 56g more protein to hit today's target
    </Text>
  </View>

  <ArrowRight size={24} color="#000" />
</View>
        <RecentCards/>
      </ScrollView>

    </SafeAreaView>
  )
}

export default Home
const style=StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'#f5f5f7'
},
header:{
  flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
},
greeting: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 6,
  },
  name: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
})