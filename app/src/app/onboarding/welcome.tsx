import {StyleSheet} from 'react-native'
import { Block ,Button,Text,useTheme} from 'galio-framework';
import { Sparkles, Camera, TrendingUp, Brain } from "lucide-react";
const welcome = () => {
    const {colors,sizes,shadows}=useTheme();
      const features = [
    { icon: Camera, label: "AI Food Recognition", color: "#22C55E" },
    { icon: TrendingUp, label: "Weight Tracking", color: "#38BDF8" },
    { icon: Brain, label: "Smart Insights", color: "#A78BFA" },
  ];
  
  return (
    <Block safe style={[{backgroundColor:colors.background},styles.container]} >
      <Block flex center>
            <Text style={[{color:colors.text,fontSize:sizes.H2}]}>
                NutriLens AI
            </Text>
            <Text style={[{color:colors.text,fontSize:sizes.H1}]}>
                Track Your Health With AI 
            </Text>
            <Text style={[{color:colors.textSecondary}]}>
                Effortlessly monitor your nutrition, calories, and fitness goals
            </Text>
      </Block>
      <Block>
        {features.map((feature)=>{
            const Icon=feature.icon;
            const label=feature.label;
            const color=feature.color;
            return (
            <Block flex flex-column center >
                <Block center style={{height:50,width:50,marginBottom:10}}>
                <Icon  style={{height:50,width:50,color:color}}/>
                </Block>
                <Text>{label}</Text>
            </Block>
            )
            })}
      </Block>
      <Block flex flex-column center>
            <Button style={{...styles.button, backgroundColor: colors.primary, marginBottom: 10}}
            textStyle={{color:colors.black}}
            >
                <Text>Get Started</Text>
            </Button>
      </Block>
    </Block>
  )
}

export default welcome

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:12
    },
    button:{
        width:'100%', 
        borderRadius:10, 
        display:'flex', 
        justifyContent:'center', 
        alignItems:'center'
    }
})