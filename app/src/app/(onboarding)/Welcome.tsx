import { View, Text,StyleSheet,Dimensions,TouchableOpacity } from 'react-native'
import { useState, useRef, type ReactNode } from 'react'
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { useRouter } from "expo-router"
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
    console.log("Welcome page opened")
    const [activeIndex,setActiveIndex]=useState(0)
    const carouselRef=useRef<ICarouselInstance>(null)

    const handleNext=()=>{
        if(activeIndex<slides.length-1){
            carouselRef.current?.next()
        }
        else{
            
        }
    }
    
  return (
    <View style={styles.container}>
      <View>

      </View>
      <Carousel
      ref={carouselRef}
      width={width}
      height={400}
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
            {item.component}
            <Text>{item.title}</Text>
            <Text>{item.smallText}</Text>
            <Text>{item.description}</Text>
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
      <TouchableOpacity>
        <Text>
            {activeIndex===slides.length-1?'Get Started':'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Welcome
const styles=StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'#f5f5f7'
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
})