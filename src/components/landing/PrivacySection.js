import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function PrivacySection() {
  return (
    <Animated.View
      style={styles.container}
      entering={FadeInUp.duration(600).delay(200)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>نحافظ على خصوصيتك</Text>
        <Text style={styles.subtitle}>
          بياناتك مشفرة ومحفوظة بأعلى معايير الأمان – لا تتم مشاركة معلوماتك مع
          أي جهة غير مصرح لها.
        </Text>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>تشفير البيانات</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>اتصال آمن</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>خصوصية تامة</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 56, // Equivalent to py-14 (3.5rem * 16px)
    paddingHorizontal: 24, // Equivalent to px-6 (1.5rem * 16px)
    backgroundColor: "#F9FAFB", // Equivalent to bg-body (light gray)
    // direction: "rtl", // RTL for Arabic
  },
  content: {
    maxWidth: Dimensions.get("window").width > 768 ? 960 : "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32, // Equivalent to text-4xl (2rem * 16px)
    fontWeight: "bold",
    color: "#27548a", // Equivalent to text-darkTeal
    marginBottom: 16, // Equivalent to mb-4 (1rem * 16px)
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20, // Equivalent to text-xl (1.25rem * 16px)
    color: "#27548a", // Equivalent to text-darkTeal
    marginBottom: 24, // Equivalent to mb-6 (1.5rem * 16px)
    textAlign: "center",
    lineHeight: 28,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16, // Equivalent to gap-4 (1rem * 16px)
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#27548a", // Equivalent to badge-primary (dark teal)
    paddingVertical: 16, // Equivalent to p-4 (1rem * 16px)
    paddingHorizontal: 16,
    borderRadius: 9999, // Large radius for badge-like appearance
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
