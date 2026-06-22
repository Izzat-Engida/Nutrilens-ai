import { View, Text ,SafeAreaView,StyleSheet,TouchableOpacity} from 'react-native'
import {useState} from 'react'
import {LucideIcon,Sofa,Footprints,Flame,Bike} from "lucide-react-native"
interface ChoiceCardProps{
  Icon:LucideIcon,
  title:string,
  description:string,
  selected?:boolean ,
  onPress?:()=>void
}

const ChoiceCard=({Icon,title,description,selected,onPress}:ChoiceCardProps)=>{
    return(
        <TouchableOpacity onPress={onPress}
        style={[styles.card,
        {borderColor:selected?"#0071E3":"#f5f5f7",
        shadowColor:selected?"#0071E3":"transparent",
        shadowOpacity:selected?0.15:0,
        shadowRadius:selected?10:0,
        shadowOffset:{width:0,height:4},
        }]}>
            <View style={[styles.iconContainer,{backgroundColor:selected?"#0071E3":"#f5f5f7"}]}>
                <Icon size={26} color={selected?"#fff":"gray"} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
        
            <View style={[styles.radioOuter, { borderColor: selected ? "#0071E3" : "#d1d1d6" }]}>
        {selected && <View style={styles.radioInner} />}
      </View>

    
        </TouchableOpacity>
    )
}
const ActiveCard = () => {
const [selected,setSelected]=useState(0)
    const choices=[
        {
            Icon:Sofa,
            title:"Sedentary",
            description:"Mostly sitting,little exercise",
            
        },
        {
            Icon:Footprints,
            title:"Lightly active",
            description:"Walks & light workout 1-3 days a week",
            
        },
        {
            Icon:Bike,
            title:"Active",
            description:"Exercise 3-5 days a week",
           
        },
        {
            Icon:Flame,
            title:"VeryActive",
            description:"Intense training 6-7 days a week",
            
        }
    ]
  return (
      <SafeAreaView style={styles.container}>
            <View style={styles.header}>
    <Text style={styles.heading}>How active are you?</Text>
    <Text style={styles.subheading}>An honest answer gives the most accurate plan.</Text>
            </View>
          <View style={{width:"100%", alignItems:"center"}}>
            {
                choices.map((choice,index)=>(
                    <ChoiceCard key={index} {...choice} 
                    selected={selected===index}
                    onPress={()=>setSelected(index)}
                    />
                ))
            }
          </View>
        </SafeAreaView>
  )
}

export default ActiveCard
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        paddingHorizontal:20,
        paddingTop:20,

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

    card:{
        flexDirection:"row",
        marginBottom:12,
        borderColor:"gray",
        borderWidth:1.5,
        borderRadius:20,
        width:"100%",
        alignItems:"center",
            paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    elevation: 2,

    },
    iconContainer:{
        width:50,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:100,
        marginRight:12,
    },
      textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: "gray",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0071E3",
  },

})