import { View, Text ,StyleSheet,Dimensions, TouchableOpacity} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import {type ReactNode, useState,useRef} from 'react'
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import {  ArrowRight,ChevronRight,ChevronLeft } from "lucide-react-native"
import GoalCard from '@/components/GoalCard'
import AboutYou from '@/components/AboutYou'
import TargetCard from '@/components/TargetCard'
import ActiveCard from '@/components/ActiveCard'
import { useRouter } from 'expo-router'

interface slide{
  id:string,
  title:string,
  description:string,
  component:ReactNode
}
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

const { width } = Dimensions.get('window')

const Goals = () => {
  const router=useRouter()
  const [activeIndex,setActiveIndex]=useState(0)
  const carouselRef=useRef<ICarouselInstance>(null)

  const handleNext=()=>{
    if(activeIndex<slides.length-1){
        carouselRef.current?.next()
    }else{
       router.replace('/pages/Home')
    }
  }
  const handlePrev=()=>{
    if(activeIndex>0 && activeIndex<slides.length){
        carouselRef.current?.prev()
    }
  }
  return (
    <SafeAreaView style={styles.container}>

    <View>
    <View>
      {activeIndex!==0 && (
        <ChevronLeft size={24} color="#0071E3" onPress={handlePrev}/>
      )}
    </View>
    <View style={styles.lineContainer}>
      {slides.map((_,index)=>(
        <View
        key={index}
        style={[styles.line,{
          backgroundColor:index===activeIndex? '#0071E3':"#D1D5DB",
        }]}
        />
      ))}
    </View>
    </View>
    <Carousel
      ref={carouselRef}
      width={width}
      height={600}
      data={slides}
      loop={false}
      onSnapToItem={(index) => setActiveIndex(index)}
      mode="parallax"
      modeConfig={{
          parallaxScrollingScale:0.9,
          parallaxScrollingOffset: 50,
      }}
      renderItem={({item})=>(
        <View>
          <View style={styles.header}>
          <Text style={styles.heading}>{item.title}</Text>
          <Text style={styles.subheading}>{item.description}</Text>
          </View>
          {item.component}
        </View>
      )}
      />
      <View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {activeIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
                </Text>
              <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
  lineContainer:{

  },
  line:{

  },
    button: {
    flexDirection: "row",
    backgroundColor: "#0071E3",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
   buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})