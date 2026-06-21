import { Tabs } from "expo-router"
import { Home,Utensils,ScanLine,User,Sparkles} from "lucide-react-native"
import {View,StyleSheet} from "react-native"
const TabBarIcon = ({ Icon, color }: { Icon: React.ComponentType<any>; color: string }) => (
  <Icon size={24} color={color} />
)

const ScanButton=()=>{
  return(
    <View style={styles.scanButtonContainer}>
      <ScanLine size={26} color={"#fff"} />
    </View>
  )
}
const PageLayout = () => {
  return (
    <Tabs
    screenOptions={{headerShown:false,
        tabBarActiveTintColor: '#0071E3',
        tabBarInactiveTintColor: '#9CA3AF',
         tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 16,
          right: 16,
          height: 70,
          borderRadius: 50,
          backgroundColor: "#fff", 
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
    }}
    
    >
        <Tabs.Screen name="Home"
        options={{
            title:"Home",
            tabBarIcon:({color})=>(
                <TabBarIcon Icon={Home} color={color}/>
            )
        }}
        />
        <Tabs.Screen name="Meals"
          options={{
            title:"Meals",
            tabBarIcon:({color})=>{
                return (
                  <TabBarIcon Icon={Utensils} color={color} />
                )
            }
          }}
        />
        <Tabs.Screen name="Scan"
        options={{
            title:"",
            tabBarIcon:()=><ScanButton/>,
            tabBarLabelStyle:{height:0}
        }}
        />
        <Tabs.Screen name="Insights"
        options={{
          title:"Insights",
          tabBarIcon:({color})=>{
            return (
              <TabBarIcon Icon={Sparkles} color={color} />
            )
          }
        }}
        />
        <Tabs.Screen name="Profile"
        options={{
          title:"Profile",
          tabBarIcon:({color})=>{
            return (
              <TabBarIcon Icon={User} color={color} />
            )
          }
        }}
        />
    </Tabs>
  )
}

export default PageLayout
const styles = StyleSheet.create({
  scanButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: "#0071E3",
    justifyContent: "center",
    alignItems: "center",
    top: -2, 
    shadowColor: "#0071E3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
})

