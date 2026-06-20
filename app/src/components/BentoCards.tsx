import { View, Text,StyleSheet} from 'react-native'
import React from 'react'
import {Drumstick,Droplet,Wheat,CircleDot} from "lucide-react-native"
import * as Progress from 'react-native-progress';
import WeightCard from './WeightCard';

const TopBarIcon = ({ Icon, color }: { Icon: React.ComponentType<any>; color: string }) => (
  <Icon size={28} color={color}  style={{backgroundColor:"#0066cc42",borderRadius:100}} />
)


const FoodCards=({label,total,consumed,unit,title}:{label:string,total:number,consumed:number,unit:string,title:string})=>{
    const fill=(consumed/total)*100;
    const temp: Record<string, React.ComponentType<any>> = {
      Drumstick,
      Droplet,
      Wheat,
      CircleDot,
    }

    const SelectedIcon = temp[label] || CircleDot

    return(
    <View style={styles.card}>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
      <TopBarIcon Icon={SelectedIcon} color="#0066CC" />
      <Text style={{color:"gray",fontSize:15}}>{total}{unit}</Text>
      </View>
      <View style={{flexDirection:"row",alignItems:"center"}}>
        <Text style={{color:"black",fontSize:30,fontWeight:"bold",marginRight:2}}>{consumed}</Text>
        <Text style={{color:"gray",fontSize:20}}>{unit}</Text>
      </View>
      <Text style={{color:"gray",fontSize:19}}>{title}</Text>
      <Progress.Bar animated={true} progress={(consumed/total)} width={150} color="#0066CC" unfilledColor="#f5f5f7"
      borderColor='#f5f5f7' 
       />
    </View>
    )
}


const BentoCards = () => {
  return (
    <View style={styles.container}>
        <View
        style={styles.GridView}
        >
  
      <FoodCards label="Drumstick" total={140} consumed={84} unit="g" title="Protein"/>
      <FoodCards label="Droplet" total={140} consumed={84} unit="L" title="Water"/>
      <FoodCards label="Wheat" total={140} consumed={84} unit="g" title="Carbs"/>
      <FoodCards label="CircleDot" total={140} consumed={84} unit="g" title="Fat"/>
        </View>
      <View style={styles.statsRow}>
  <WeightCard />

  <View style={styles.streakCard}>
    <Text style={styles.cardLabel}>STREAK</Text>

    <View style={{ marginTop: "auto" }}>
      <Text style={styles.streakNumber}>14</Text>
      <Text style={styles.streakDays}>days</Text>
    </View>
  </View>
</View>
    </View>
  )
}

export default BentoCards
const styles=StyleSheet.create({
        container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        margin:20
    },
  
    GridView:{
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-between"
    },
      card:{ 
        backgroundColor:"#fff",
        borderRadius:15,
        margin:5,
        padding:10,
        width:"45%",
          shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
    },
    statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
},

streakCard: {
  width: "30%",
  backgroundColor: "#fff",
  borderRadius: 24,
  padding: 20,
  height: 240,
  marginLeft:15,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
},

cardLabel: {
  fontSize: 14,
  color: "#6B7280",
  letterSpacing: 1,
},

streakNumber: {
  fontSize: 44,
  fontWeight: "700",
},

streakDays: {
  fontSize: 18,
  color: "#6B7280",
},
    
})