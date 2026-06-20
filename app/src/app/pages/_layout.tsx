import { Tabs } from "expo-router"
import { Home} from "lucide-react-native"

const TabBarIcon = ({ Icon, color }: { Icon: React.ComponentType<any>; color: string }) => (
  <Icon size={28} color={color} />
)


const PageLayout = () => {
  return (
    <Tabs
    screenOptions={{headerShown:false,
        tabBarActiveBackgroundColor:'#ffffff'
    }}
    >
        <Tabs.Screen name="Home"
        options={{
            title:"Home",
            tabBarIcon:({focused})=>(
                <TabBarIcon Icon={Home} color={focused?"#0071E3":"gray"}/>
            )
        }}
        />
    </Tabs>
  )
}

export default PageLayout