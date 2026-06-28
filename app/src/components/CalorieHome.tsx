import { View, Text,StyleSheet } from 'react-native'
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import { useNutritionStore } from '@/store/nutritionStore'


const Card = ({ name, num }: { name: string; num: number }) => {
    return (
        <View style={styles.card}>
            <Text style={{color:"gray",fontSize:10}}>{name}</Text>
            <Text style={{color:"black",fontSize:15,fontWeight:"bold"}}>{num}</Text>
        </View>
    )
}
const CalorieHome = () => {
    const calories = useNutritionStore((state) => state.caloriesConsumed);
    const goal = useNutritionStore((state) => state.calorieGoal);
    const fill=(calories/goal)*100;
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
       size={250}
       width={20}
       fill={fill}
       
       tintColor="#0066CC"
       backgroundColor='#f5f5f7'
       rotation={360}
       lineCap="round"
       style={{marginVertical:20}}
      >
        {
        ()=>(
            <View style={{justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:20,color:"gray"}}>CONSUMED</Text>
                <Text style={{fontSize:40,fontWeight:"bold"}}>{calories}</Text>
                <Text style={{fontSize:20,color:"gray"}}>of {goal} kcal</Text>
            </View>
        )
        }
      </AnimatedCircularProgress>
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",
    marginHorizontal:10
    }}>
        <Card name="GOAL" num={goal}/>
        <Card name="EATEN" num={calories}/>
        <Card name ="LEFT" num={goal-calories}/>
    </View>
    </View>
  )
}

export default CalorieHome
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        borderRadius:15,
        justifyContent:"center",
        alignItems:"center",
        margin:20,
          shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
    },
    card:{
        flex:1,
        backgroundColor:"#f5f5f7",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:15,
        margin:5,
        height:50
    }
 

})
