import { View, Text,StyleSheet,Dimensions,TouchableOpacity ,SafeAreaView} from 'react-native'
import { useState, useRef, type ReactNode } from 'react'
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { useRouter } from "expo-router"
import { Sparkles, ArrowRight } from "lucide-react-native"
import WelcomeIllustration from '@/components/WelcomeIllustration'
import ScanIllustration from '@/components/ScanIllustration'
import InsightsIllustration from '@/components/InsightIllustration'

const { width } = Dimensions.get('window')
interface Slide{
    component: ReactNode,
    id:string,
    title:string, 
    smallText:string,
    description:string
}

const slides:Slide[]=[
    {
        component:<WelcomeIllustration/>,
        id:'1',
        title:'WELCOME',
        smallText:'Track health, beautifully',
        description:'Photograph any meal. NutriLens identifies foods, estimates calories, and learns your habits'
    },
    {
        component:<ScanIllustration/>,
        id:'2',
        title:'SMART SCAN',
        smallText:'Scan food instantly',
        description:'Point your camera at a plate. Our AI vision model detects ingredients and portions in seconds.'
    },{
        component:<InsightsIllustration/>,
        id:'3',
        title:'INSIGHTS',
        smallText:'Reach goals faster.',
        description:'Personalized coaching, weight trends, and weekly progress reports — all in one place.'
    }
]
const Welcome = () => {
    const router=useRouter()
    const [activeIndex,setActiveIndex]=useState(0)
    const carouselRef=useRef<ICarouselInstance>(null)

    const handleNext=()=>{
        if(activeIndex<slides.length-1){
            carouselRef.current?.next()
        }
        else{
            router.replace('/(auth)/sign-in')
        }
    }
    const handleSkip=()=>{
      router.replace('/(auth)/sign-in')
    }
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Sparkles size={16} color="#fff" />
          </View>
          <Text style={styles.brandText}>NutriLens AI</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
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
        <View style={styles.slide}>
            {item.component}
            <View style={styles.textBlock}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSmallText}>{item.smallText}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
            </View>
          </View>
      )}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:index===activeIndex? '#0071E3':"#D1D5DB",
                width:index===activeIndex? 20:8
              }
              
            ]}
          />
        ))}
      </View>
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

export default Welcome
const styles=StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'#fff',
    paddingTop:16,
    marginTop:50
},
 header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0071E3",
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  skipText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
   slide: {
    flex: 1,
    paddingHorizontal: 0,
    height: "100%",
  },
  textBlock: {
    marginTop: 50,
    alignItems: "center",
  },
  slideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0071E3",
    letterSpacing: 1,
    marginBottom: 10,
  },
  slideSmallText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
   slideDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
 dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
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