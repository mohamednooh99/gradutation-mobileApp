import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "قدم شكواك",
      description: "املأ النموذج بتفاصيل شكواك",
    },
    {
      step: "2",
      title: "تتبع الحالة",
      description: "راقب تقدم معالجة شكواك",
    },
    {
      step: "3",
      title: "احصل على الرد",
      description: "استلم الرد من الجهة المختصة",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>كيف تعمل المنصة؟</Text>
      <Text style={styles.sectionSubtitle}>خطوات بسيطة لتقديم شكواك</Text>

      <View style={styles.stepsContainer}>
        {steps.map((item, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{item.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#f5f5f5",
    marginTop: 2,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183b4e",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: "#183b4e",
    textAlign: "center",
    marginBottom: 40,
  },
  stepsContainer: {
    gap: 20,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stepNumber: {
    width: 50,
    height: 50,
    backgroundColor: "#27548a",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#183b4e",
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: "#183b4e",
    lineHeight: 22,
  },
});

export default HowItWorksSection;
