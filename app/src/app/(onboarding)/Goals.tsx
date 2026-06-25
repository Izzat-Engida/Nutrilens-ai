import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { type ReactNode, useState, useRef } from 'react'
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { ArrowRight, ChevronLeft } from "lucide-react-native"
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
      description:"We'll personalize your daily calories and macros around it.",
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
 id:"4",
      title:"Your target & pace",
      description:"We'll build a plan to get you there safely.",
      component:<TargetCard/>
    }
  ]

const { width, height } = Dimensions.get('window')
const carouselHeight = Math.min(640, Math.max(360, height - 205))

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
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.backButton, activeIndex === 0 && styles.backButtonHidden]}
          onPress={handlePrev}
          disabled={activeIndex === 0}
          activeOpacity={0.75}
        >
          <ChevronLeft size={24} color="gray" />
        </TouchableOpacity>

        <View style={styles.lineContainer}>
          {slides.map((_,index)=>(
            <View
              key={index}
              style={[
                styles.line,
                {
                  backgroundColor:index===activeIndex? '#0071E3':"#D1D5DB",
                  flex:index===activeIndex? 1.45:1,
                }
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepText}>{activeIndex + 1}/{slides.length}</Text>
      </View>

    <Carousel
      ref={carouselRef}
      width={width}
      height={carouselHeight}
      data={slides}
      loop={false}
      onSnapToItem={(index) => setActiveIndex(index)}
      onConfigurePanGesture={(gesture) => {
        gesture.activeOffsetX([-10, 10]).failOffsetY([-12, 12])
      }}
      mode="parallax"
      modeConfig={{
          parallaxScrollingScale:0.9,
          parallaxScrollingOffset: 50,
      }}
      renderItem={({item})=>(
        <ScrollView
          style={[styles.slide, { height: carouselHeight }]}
          contentContainerStyle={styles.slideContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>SETUP</Text>
            <Text style={styles.heading}>{item.title}</Text>
            <Text style={styles.subheading}>{item.description}</Text>
          </View>
          <View style={styles.componentWrapper}>
            {item.component}
          </View>
        </ScrollView>
      )}
      />
      <View style={styles.buttonWrapper}>
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
    paddingTop: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0071e31d",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonHidden: {
    opacity: 0,
  },
  stepText: {
    width: 38,
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textAlign: "right",
  },
  lineContainer:{
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 14,
  },
  line:{
    height: 6,
    borderRadius: 3,
  },
  slide: {
    flex: 1,
  },
  slideContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  componentWrapper: {
    flexGrow: 1,
  },
  header:{
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0071E3",
    letterSpacing: 1,
    marginBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 22,
  },
  buttonWrapper: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 30,
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
