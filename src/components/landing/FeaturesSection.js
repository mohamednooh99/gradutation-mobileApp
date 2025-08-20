import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const FeaturesSection = () => {
  const features = [
    {
      icon: "phone-android",
      title: "سهولة الاستخدام",
      description: "واجهة بسيطة وسلسة لأي مستخدم",
    },
    {
      icon: "file-upload",
      title: "إرفق مستنداتك بسهولة",
      description: "أضف صور أو ملفات داعمة مع الشكوى لتوضيح المشكلة بشكل أفضل",
    },
    {
      icon: "notifications",
      title: "متابعة الشكوى",
      description: "تابع حالة الشكوى خطوة بخطوة حتى يتم حلها",
    },
    {
      icon: "trending-up",
      title: "تقارير واحصائيات",
      description: "لوحات تحكم متكامله للجهات الحكوميه مع تحليلات ذكيه",
    },
    {
      icon: "group",
      title: "تعدد المستخدمين",
      description: "نظام متكامل للمواطنين والجهات الحكوميه والمشرفين",
    },
    {
      icon: "security",
      title: "امان وحمايه",
      description: "بيانات محميه وفق اعلي معايير الامان والخصوصيه",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>مميزات المنصة</Text>
      <Text style={styles.sectionSubtitle}>
        نوفر لك أفضل الخدمات لتقديم ومتابعة شكاواك
      </Text>

      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Icon
              name={feature.icon}
              size={40}
              color="#27548a"
              style={styles.featureIcon}
            />
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>
              {feature.description}
            </Text>
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
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#27548a",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  featureIcon: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27548a",
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#183b4e",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default FeaturesSection;
