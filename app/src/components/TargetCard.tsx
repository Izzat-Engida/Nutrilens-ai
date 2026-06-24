import { View, Text,StyleSheet,TouchableOpacity,
     ScrollView, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent
 } from 'react-native'
import {useState,useRef,useEffect} from 'react'

import { Sparkles, Target } from 'lucide-react-native'
import { SafeAreaView } from "react-native-safe-area-context";

const kgToLb = (kg: number) => Math.round(kg * 2.20462)
const lbToKg = (lb: number) => Math.round(lb / 2.20462)
const KgtoLb2=(kg: number) => (kg * 2.20462).toFixed(2)
interface UnitToggleProps {
  options: string[]
  selected: string
  onSelect: (unit: string) => void
}
const UnitToggle = ({ options, selected, onSelect }: UnitToggleProps) => (
  <View style={styles.unitToggle}>
    {options.map((opt) => (
      <TouchableOpacity
        key={opt}
        onPress={() => onSelect(opt)}
        style={[styles.unitToggleOption, selected === opt && styles.unitToggleOptionActive]}
      >
        <Text style={[styles.unitToggleText, selected === opt && styles.unitToggleTextActive]}>
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)
const TICK_WIDTH = 12 ;

interface RulerPickerProps {
  min: number
  max: number
  value: number
  unit: string
  onChange: (v: number) => void
  majorEvery?: number         
  formatMajorLabel?: (v: number) => string
  formatBigValue?: (v: number) => string  
}

const RulerPicker = ({
  min, max, value, unit, onChange,
  majorEvery = 5, formatMajorLabel, formatBigValue,
}: RulerPickerProps) => {
  const scrollRef = useRef<ScrollView>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [liveValue, setLiveValue] = useState(value)
  const hasMounted = useRef(false)

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width)
  }

  useEffect(() => {
    if (containerWidth === 0) return
    const x = (value - min) * TICK_WIDTH
    scrollRef.current?.scrollTo({ x, animated: hasMounted.current })
    setLiveValue(value)
    hasMounted.current = true
  }, [containerWidth, min, max])

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x
    const idx = Math.round(x / TICK_WIDTH)
    const v = Math.min(max, Math.max(min, min + idx))
    setLiveValue(v)
  }

  const commit = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x
    const idx = Math.round(x / TICK_WIDTH)
    const v = Math.min(max, Math.max(min, min + idx))
    onChange(v)
    
    scrollRef.current?.scrollTo({ x: (v - min) * TICK_WIDTH, animated: true })
  }

  const sidePadding = containerWidth / 2

  const ticks = []
  for (let v = min; v <= max; v++) {
    const isMajor = v % majorEvery === 0
    ticks.push(
      <View key={v} style={{ width: TICK_WIDTH, alignItems: "center" }}>
        <View style={[styles.tick, isMajor ? styles.tickMajor : styles.tickMinor]} />
        {isMajor && (
          <Text style={styles.tickLabel}>
            {formatMajorLabel ? formatMajorLabel(v) : v}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View>
      <Text style={styles.rulerBigValue}>
        {formatBigValue ? formatBigValue(liveValue) : `${liveValue}`}
        {!formatBigValue && <Text style={styles.rulerUnit}> {unit}</Text>}
      </Text>

      <View style={styles.rulerContainer} onLayout={onLayout}>
        {containerWidth > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_WIDTH}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onMomentumScrollEnd={commit}
            onScrollEndDrag={commit}
            contentContainerStyle={{ paddingHorizontal: sidePadding }}
          >
            {ticks}
          </ScrollView>
        )}

        <View style={styles.centerIndicator} pointerEvents="none" />
      </View>
    </View>
  )
}

const TargetCard = () => {
    const [targetWeight,setTargetWeight]=useState(70);
    const [pace,setPace]=useState(-1);
    const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg")

    const Weight=75;
    const calories=2400
    const paces=[
        {
            label:"Easy",
            valueinKg:0.25,
            valueinLbs:KgtoLb2(0.25)
        },{
            label:"Steady",
            valueinKg:0.5,
            valueinLbs:KgtoLb2(0.5)
        },{
            label:"Fast",
            valueinKg:0.75,
            valueinLbs:KgtoLb2(0.75)
        }
    ]
    const selectedPace = pace !== -1 ? paces[pace] : null
    const weightdiff=Math.abs(Weight-targetWeight)
    const KCAL_PER_KG_FAT = 7700

    const weeksToGoal=selectedPace? Math.max(1,Math.ceil(weightdiff/selectedPace.valueinKg)):null

    const dailyCalories = selectedPace
      ? Math.round((calories - (selectedPace.valueinKg * KCAL_PER_KG_FAT) / 7) / 10) * 10
      : null
  return (
    <SafeAreaView style={styles.container}>
            <View>
        <View style={styles.labelRow}>
            <Text style={[styles.subheading, { fontSize: 13, letterSpacing: 1 }]}>TARGET WEIGHT</Text>
        <UnitToggle options={["kg", "lb"]} selected={weightUnit} onSelect={(u) => setWeightUnit(u as "kg" | "lb")} />
        </View>
         {weightUnit === "kg" ? (
          <RulerPicker min={30} max={300} value={targetWeight} unit="kg" majorEvery={10} onChange={setTargetWeight} />
        ) : (
          <RulerPicker
            min={kgToLb(30)}
            max={kgToLb(300)}
            value={kgToLb(targetWeight)}
            unit="lb"
            majorEvery={20}
            onChange={(lb) => setTargetWeight(lbToKg(lb))}
          />
        )}
      </View>
      <View>
        <Text style={[styles.subheading, { fontSize: 13, marginBottom: 10, letterSpacing: 1 }]}>PACE</Text>
        <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:24}}>
        {
            paces.map((data,index)=>(
                <TouchableOpacity key={index} onPress={()=>setPace(index)}>
                <View style={[styles.paceCard,{
                borderColor: (pace === index) ? "#0071E3" : "#f5f5f7",
                shadowColor: (pace === index) ? "#0071E3" : "transparent",
                shadowOpacity: (pace === index) ? 0.15 : 0,
                shadowRadius: (pace === index) ? 10 : 0,
                shadowOffset: { width: 0, height: 4 },
                backgroundColor: (pace === index) ? "#0071e31d" : "#f5f5f7"
                }]}>
                    <Text style={[styles.subheading,{fontSize:16,fontWeight:"800",color:(pace===index)?"#0071E3":"#000"}]}>{data.label}</Text>
                    <Text style={[styles.subheading,{fontSize:16,fontWeight:"800",color:(pace===index)?"#0071E3":"#000"}]}>{(weightUnit==="kg")?data.valueinKg:data.valueinLbs} {weightUnit==="kg"?"kg/wk":"lb/wk"}</Text>
                </View>
                </TouchableOpacity>
            ))
        }
        </View>
      </View>
        {selectedPace && (
        <View style={styles.planCard}>
          <View style={styles.planHeaderRow}>
            <View style={styles.planIconCircle}>
              <Sparkles size={16} color="#0071E3" />
            </View>
            <Text style={styles.planHeaderText}>YOUR AI PLAN</Text>
          </View>
          <View style={styles.planStatsRow}>
            <View style={styles.planStatBox}>
              <Text style={styles.planStatLabel}>DAILY CALORIES</Text>
              <Text style={styles.planStatValue}>
                {dailyCalories}
                <Text style={styles.planStatUnit}> kcal</Text>
              </Text>
            </View>
            <View style={[styles.planStatBox, { marginLeft: 12 }]}>
              <Text style={styles.planStatLabel}>ETA TO GOAL</Text>
              <Text style={styles.planStatValue}>
                {weeksToGoal}
                <Text style={styles.planStatUnit}> weeks</Text>
              </Text>
            </View>
          </View>

          <View style={styles.planFooterPill}>
            <Target size={14} color="#0071E3" />
            <Text style={styles.planFooterText}>Adjustable anytime in Profile</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default TargetCard
const styles=StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
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
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 4,
  },
    unitToggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f2",
    borderRadius: 20,
    padding: 3,
  },
  unitToggleOption: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 17,
  },
  unitToggleOptionActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  unitToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "gray",
  },
  unitToggleTextActive: {
    color: "#000",
  },
    rulerBigValue: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 6,
  },
  rulerUnit: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
  rulerContainer: {
    height: 70,
    justifyContent: "center",
  },
  tick: {
    backgroundColor: "#d1d1d6",
    borderRadius: 2,
  },
  tickMinor: {
    width: 2,
    height: 18,
  },
  tickMajor: {
    width: 2,
    height: 32,
    backgroundColor: "#9a9aa0",
  },
  tickLabel: {
    fontSize: 11,
    color: "gray",
    marginTop: 4,
    position: "absolute",
    top: 34,
    width: 40,
    left: -19,
    textAlign: "center",
  },
  centerIndicator: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 14,
    width: 3,
    marginLeft: -1.5,
    backgroundColor: "#0071E3",
    borderRadius: 2,
  },
  paceCard:{
        borderWidth: 2,
    borderColor: "#d1d1d6",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  planCard: {
    borderWidth: 1,
    borderColor: "#f0f0f2",
    borderRadius: 24,
    padding: 16,
    marginTop: 4,
  },
  planHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  planIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0071e31d",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
   planHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0071E3",
    letterSpacing: 0.5,
  },
   planStatsRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  planStatBox: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderRadius: 16,
    padding: 14,
  },
   planStatLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "gray",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
   planStatValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
   planStatUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: "gray",
  },
  planFooterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0071e31d",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  planFooterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0071E3",
    marginLeft: 8,
  },
})