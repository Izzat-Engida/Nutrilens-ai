import { View, Text, StyleSheet } from "react-native"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { Trophy, Check } from "lucide-react-native"

const chartWidth = 260
const chartHeight = 90

const linePath = "M0,55 L35,45 L70,50 L105,30 L140,38 L175,18 L210,10 L245,5"
const fillPath = `${linePath} L245,${chartHeight} L0,${chartHeight} Z`

const InsightsIllustration = () => {
  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>WEIGHT TREND</Text>
        <Text style={styles.cardValue}>72.0 kg</Text>

        <Svg width={chartWidth} height={chartHeight} style={{ marginTop: 8 }}>
          <Defs>
            <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0071E3" stopOpacity={0.25} />
              <Stop offset="1" stopColor="#0071E3" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={fillPath} fill="url(#fade)" />
          <Path
            d={linePath}
            stroke="#0071E3"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      
      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Trophy size={16} color="#0071E3" />
          <Text style={styles.pillText}>14-day streak</Text>
        </View>

        <View style={styles.pill}>
          <Check size={16} color="#0071E3" />
          <Text style={styles.pillText}>86% goals</Text>
        </View>
      </View>
    </View>
  )
}

export default InsightsIllustration

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    height:400
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
})