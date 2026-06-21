import { View, Text, StyleSheet } from "react-native"

const ScanIllustration = () => {
  return (
    <View style={styles.container}>
   
      <View style={styles.frame} />

  
      <View style={styles.riceLine} />

     
      <View style={[styles.pill, styles.chickenPill]}>
        <Text style={styles.emoji}>🍗</Text>
        <Text style={styles.pillText}>Chicken</Text>
      </View>

      <View style={[styles.pill, styles.ricePill]}>
        <Text style={styles.emoji}>🍚</Text>
        <Text style={styles.pillText}>Rice</Text>
      </View>

   
      <View style={[styles.pill, styles.saladPill]}>
        <Text style={styles.emoji}>🥗</Text>
        <Text style={styles.pillText}>Salad</Text>
      </View>
    </View>
  )
}

export default ScanIllustration

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 380,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: 280,
    height: 280,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#93C5FD",
    backgroundColor: "#F3F4F6",
  },
  riceLine: {
    position: "absolute",
    top: 190,
    left: "20%",
    width: 275,
    height: 1.5,
    backgroundColor: "#0071E3",
  },
  pill: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  chickenPill: {
    top: 50,
    left: 30,
  },
  ricePill: {
    top: 175,
    right: 35,
  },
  saladPill: {
    bottom: 45,
    left: 50,
  },
})