import { View, Text, StyleSheet } from "react-native"
import { TrendingDown, Sparkles } from "lucide-react-native"

const WelcomeIllustration = () => {
  return (
    <View style={styles.container}>
    
      <View style={[styles.card, styles.todayCard]}>
        <Text style={styles.todayLabel}>TODAY</Text>
        <View style={styles.kcalRow}>
          <Text style={styles.kcalNumber}>1,450</Text>
          <Text style={styles.kcalUnit}> kcal</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

 
      <View style={[styles.card, styles.detectedCard]}>
        <View style={styles.bowlIcon}>
          <Text style={{ fontSize: 18 }}>🥗</Text>
        </View>
        <View>
          <Text style={styles.detectedLabel}>Detected</Text>
          <Text style={styles.matchLabel}>96% match</Text>
        </View>
      </View>

      <View style={[styles.card, styles.weightCard]}>
        <TrendingDown size={20} color="#0071E3" />
        <View>
          <Text style={styles.weightNumber}>-1.4 kg</Text>
          <Text style={styles.weightLabel}>this month</Text>
        </View>
      </View>

   
      <View style={styles.fab}>
        <Sparkles size={28} color="#fff" />
      </View>
    </View>
  )
}

export default WelcomeIllustration

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 400,
    position: "relative",
  },
  card: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  todayCard: {
    top: 20,
    left: 10,
    width: 200,
    padding: 16,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  kcalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  kcalNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },
  kcalUnit: {
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 2,
    marginBottom: 3,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    width: "65%",
    height: "100%",
    backgroundColor: "#0071E3",
    borderRadius: 3,
  },
  detectedCard: {
    top: 100,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  bowlIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  detectedLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  matchLabel: {
    fontSize: 12,
    color: "#0071E3",
    fontWeight: "500",
  },
  weightCard: {
    bottom: 60,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  weightNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  weightLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0071E3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0071E3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
})