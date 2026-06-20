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


const BetnoCards = () => {
  return (
    <View style={styles.container}>
        <View
        style={styles.GridView}
        >
  
      <FoodCards label="Drumstick" total={140} consumed={84} unit="g" title="Protein"/>
      <FoodCards label="Droplet" total={140} consumed={84} unit="g" title="Water"/>
      <FoodCards label="Wheat" total={140} consumed={84} unit="g" title="Carbs"/>
      <FoodCards label="CircleDot" total={140} consumed={84} unit="g" title="Fat"/>
        </View>
    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
    <WeightCard/>
    <View>
        <Text style={{color:"gray",fontSize:15}}>
            STREAK
        </Text>
    </View>
    </View>
    </View>
  )
}

export default BetnoCards
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
    },
    
})