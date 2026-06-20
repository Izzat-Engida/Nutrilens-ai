import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import {Drumstick,Pizza,Apple,Beef, Icon} from "lucide-react-native"
const RecentCards = () => {

  const data = [
  {
    icon: Drumstick,
    foodName: "Grilled Chicken Breast",
    calories: 220,
    time: "08:15 AM",
  },
  {
    icon: Apple,
    foodName: "Apple & Almonds",
    calories: 180,
    time: "11:00 AM",
  },
  {
    icon: Beef,
    foodName: "Beef Rice Bowl",
    calories: 520,
    time: "01:30 PM",
  },
  {
    icon: Pizza,
    foodName: "Veggie Wrap",
    calories: 320,
    time: "06:45 PM",
  },
];
  return (
    <View>
      <View style={{flexDirection:"row",justifyContent:"space-between",marginHorizontal:20}}>
      <Text style={{color:"black",fontSize:20,fontWeight:"bold"}}>Recent meals</Text>
      <Text style={{color:"#0066CC",fontSize:15,fontWeight:"bold"}}>See all</Text>
      </View>
      {data.map((item,index)=>{
        const IconComponent = item.icon;
        return(
          <View
          key={index}
          style={{
            flexDirection:"row",
            justifyContent:"space-between",
            backgroundColor:"#fff",
            borderRadius:20,
            margin:5,
            padding:10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.01,
            shadowRadius: 8,
            elevation: 3,
          }}
          
          >
            <View style={{flexDirection:"row",gap:15}}>
            <View style={{justifyContent:"center",alignItems:"center" ,borderRadius:50,backgroundColor:"#f5f5f7"}}>
              <IconComponent 
              size={30} 
              color="#0066CC"
              />
            </View>
            <View>
              <Text style={{color:"black",fontSize:15,fontWeight:"bold"}}>{item.foodName}</Text>
              <Text>{item.time}</Text>
            </View>
            </View>
            <View>
              <Text><Text style={{color:"black",fontSize:15,fontWeight:"bold"}}>{item.calories} </Text>kcal</Text>
            </View>
          </View>
        )
      })}

    </View>
  )
}

export default RecentCards
const styles=StyleSheet.create({

})