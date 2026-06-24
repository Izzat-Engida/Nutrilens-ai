import { View, Text ,StyleSheet, SafeAreaView} from 'react-native'
import React,{type ReactNode} from 'react'
import GoalCard from '@/components/GoalCard'
import AboutYou from '@/components/AboutYou'
import TargetCard from '@/components/TargetCard'
import ActiveCard from '@/components/ActiveCard'

interface slide{
  id:string,
  title:string,
  description:string,
  component:ReactNode
}
const Goals = () => {
  const slides:slide[]=[
    {
      id:"1",
      title:"What's your goal?",
      description:"We'll personalize you daily calories and macros around it",
      component:<GoalCard/>
    },{
       id:"2",
      title:"A bit about you",
      description:"Used to estimate your calorie & macro needs",
      component:<AboutYou/>
    },{
 id:"3",
      title:"How active are you?",
      description:"An honest answer gives the most accurate plan.",
      component:<ActiveCard/>
    },{
 id:"3",
      title:"Your target & pace",
      description:"We'll build a plan to get you there safely.",
      component:<TargetCard/>
    }
  ]
  return (
    <SafeAreaView style={styles.container}>
             {/* <View style={styles.header}>
<Text style={styles.heading}>What's your goal?</Text>
<Text style={styles.subheading}>We'll personalize you daily calories and macros around it</Text>
        </View> */}


    </SafeAreaView>
  )
}

export default Goals

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   header:{
        marginBottom:24,
    },
      heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    fontWeight: "400",
    color: "gray",
    lineHeight: 20,
  },

})