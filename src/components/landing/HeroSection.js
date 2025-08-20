import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HeroSection = ({ navigation }) => {
  return (
    <View style={styles.heroSection}>
      <View style={styles.heroContent}>
        <Text style={styles.welcomeText}>مرحباً بك في</Text>
        <Text style={styles.titleText}>
          منصة <Text style={styles.brandText}>شكوتك</Text> لتقديم الشكاوى
          والمقترحات
        </Text>
        <Text style={styles.descriptionText}>
          سهّل على نفسك تقديم الشكاوى وربطها بالجهة المختصة، وتابع حالتها لحظة
          بلحظة من أي مكان.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Complaint")}
          >
            <Text style={styles.primaryButtonText}>تقديم شكوى</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("ComplaintSearch")}
          >
            <Text style={styles.secondaryButtonText}>تتبع شكوى</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 50,
    paddingHorizontal: 20,
    minHeight: 400,
    justifyContent: "center",
  },
  heroContent: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#183b4e",
    marginBottom: 16,
    textAlign: "center",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#183b4e",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 24,
  },
  brandText: {
    color: "#27548a",
  },
  descriptionText: {
    fontSize: 18,
    color: "#183b4e",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#27548a",
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 140,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#27548a",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 8,
    minWidth: 120,
  },
  secondaryButtonText: {
    color: "#27548a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HeroSection;
