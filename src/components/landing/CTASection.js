import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CTASection = ({ navigation }) => {
  return (
    <View style={styles.ctaSection}>
      <Text style={styles.ctaTitle}>ابدأ الآن في تقديم شكواك</Text>
      <Text style={styles.ctaSubtitle}>
        انضم إلى آلاف المواطنين الذين يستخدمون منصة شكوتك
      </Text>

      <View style={styles.ctaButtons}>
        <TouchableOpacity
          style={styles.ctaPrimaryButton}
          onPress={() => navigation.navigate("Complaint")}
        >
          <Text style={styles.ctaPrimaryButtonText}>تقديم شكوى جديدة</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.ctaSecondaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.ctaSecondaryButtonText}>إنشاء حساب</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ctaSection: {
    backgroundColor: "#27548a",
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 2,
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 17,
    color: "#f5eedc",
    textAlign: "center",
    marginBottom: 40,
  },
  ctaButtons: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ctaPrimaryButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 140,
  },
  ctaPrimaryButtonText: {
    color: "#27548a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  ctaSecondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  ctaSecondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CTASection;
