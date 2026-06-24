import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";


const cmToInches = (cm: number) => Math.round(cm / 2.54)
const inchesToCm = (inches: number) => Math.round(inches * 2.54)
const kgToLb = (kg: number) => Math.round(kg * 2.20462)
const lbToKg = (lb: number) => Math.round(lb / 2.20462)


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

const AboutYou = () => {
  const [sex, setSex] = useState(-1)
  const [age, setAge] = useState(30)
  const [height, setHeight] = useState(170) 
  const [weight, setWeight] = useState(70) 

  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm")
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg")

  return (
    <SafeAreaView style={styles.container}>

      <View>
        <Text style={[styles.subheading, { fontSize: 13, marginBottom: 10, letterSpacing: 1 }]}>SEX</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
          {["Female", "Male", "Other"].map((label, index) => (
            <TouchableOpacity key={label} onPress={() => setSex(index)}>
              <View style={[styles.genderCard, {
                borderColor: (sex === index) ? "#0071E3" : "#f5f5f7",
                shadowColor: (sex === index) ? "#0071E3" : "transparent",
                shadowOpacity: (sex === index) ? 0.15 : 0,
                shadowRadius: (sex === index) ? 10 : 0,
                shadowOffset: { width: 0, height: 4 },
                backgroundColor: (sex === index) ? "#0071e31d" : "#f5f5f7"
              }]}
              >
                <Text style={[styles.subheading, { fontSize: 16, fontWeight: "800", color: (sex === index) ? "#0071E3" : "#000" }]}>{label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subheading, { fontSize: 13, marginBottom: 4, letterSpacing: 1 }]}>AGE</Text>
        <RulerPicker min={13} max={100} value={age} unit="yrs" majorEvery={5} onChange={setAge} />

        <View style={styles.labelRow}>
          <Text style={[styles.subheading, { fontSize: 13, letterSpacing: 1 }]}>HEIGHT</Text>
          <UnitToggle options={["cm", "ft"]} selected={heightUnit} onSelect={(u) => setHeightUnit(u as "cm" | "ft")} />
        </View>
        {heightUnit === "cm" ? (
          <RulerPicker min={100} max={250} value={height} unit="cm" majorEvery={10} onChange={setHeight} />
        ) : (
          <RulerPicker
            min={cmToInches(100)}
            max={cmToInches(250)}
            value={cmToInches(height)}
            unit="in"
            majorEvery={12}
            formatMajorLabel={(v) => `${Math.floor(v / 12)}'`}
            formatBigValue={(v) => `${Math.floor(v / 12)}'${v % 12}"`}
            onChange={(inches) => setHeight(inchesToCm(inches))}
          />
        )}

        <View style={styles.labelRow}>
          <Text style={[styles.subheading, { fontSize: 13, letterSpacing: 1 }]}>WEIGHT</Text>
          <UnitToggle options={["kg", "lb"]} selected={weightUnit} onSelect={(u) => setWeightUnit(u as "kg" | "lb")} />
        </View>
        {weightUnit === "kg" ? (
          <RulerPicker min={30} max={300} value={weight} unit="kg" majorEvery={10} onChange={setWeight} />
        ) : (
          <RulerPicker
            min={kgToLb(30)}
            max={kgToLb(300)}
            value={kgToLb(weight)}
            unit="lb"
            majorEvery={20}
            onChange={(lb) => setWeight(lbToKg(lb))}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default AboutYou

const styles = StyleSheet.create({
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
  genderCard: {
    borderWidth: 2,
    borderColor: "#d1d1d6",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  // ruler picker
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

  // unit toggle
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
})