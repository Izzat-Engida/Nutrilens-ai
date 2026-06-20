import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
interface RecentCardsItem {
  icon: React.ComponentType<any>;
  foodName: string;
  calories: number;
  time: string;
}
interface RecentCardsProps {
  data: RecentCardsItem[];
}
const RecentCards = ({data}: RecentCardsProps) => {

  
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