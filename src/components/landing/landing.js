import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const LandingScreen = ({ navigation }) => {
  const features = [
    {
      icon: "description",
      title: "تقديم الشكاوى بسهولة",
      description: "قدم شكواك بخطوات بسيطة وواضحة",
    },
    {
      icon: "search",
      title: "تتبع حالة الشكوى",
      description: "تابع حالة شكواك لحظة بلحظة",
    },
    {
      icon: "security",
      title: "الخصوصية والأمان",
      description: "بياناتك محمية بأعلى معايير الأمان",
    },
    {
      icon: "schedule",
      title: "استجابة سريعة",
      description: "نضمن الرد على شكواك في أسرع وقت",
    },
  ];

  const departments = [
    "وزارة الداخلية",
    "وزارة التعليم",
    "وزارة الكهرباء",
    "وزارة الصحة",
    "وزارة الإسكان",
    "وزارة العدل",
    "وزارة التموين",
    "وزارة النقل",
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
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

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("ComplaintSearch")}
            >
              <Text style={styles.secondaryButtonText}>تتبع شكوى</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
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
                color="#2563eb"
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

      {/* How it Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>كيف تعمل المنصة؟</Text>
        <Text style={styles.sectionSubtitle}>خطوات بسيطة لتقديم شكواك</Text>

        <View style={styles.stepsContainer}>
          {[
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
          ].map((item, index) => (
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

      {/* Departments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الجهات المشاركة</Text>
        <Text style={styles.sectionSubtitle}>
          نتعاون مع جميع الجهات الحكومية لخدمتك
        </Text>

        <View style={styles.departmentsGrid}>
          {departments.map((dept, index) => (
            <View key={index} style={styles.departmentCard}>
              <Icon name="account-balance" size={24} color="#2563eb" />
              <Text style={styles.departmentName}>{dept}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>ابدأ الآن في تقديم شكواك</Text>
        <Text style={styles.ctaSubtitle}>
          انضم إلى آلاف المواطنين الذين يستخدمون منصة شكوتك
        </Text>

        <View style={styles.ctaButtons}>
          <TouchableOpacity
            style={styles.ctaPrimaryButton}
            onPress={() => navigation.navigate("ComplaintForm")}
          >
            <Text style={styles.ctaPrimaryButtonText}>تقديم شكوى جديدة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaSecondaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.ctaSecondaryButtonText}>إنشاء حساب</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  heroSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 20,
  },
  brandText: {
    color: "#2563eb",
  },
  descriptionText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#ffffff",
    marginTop: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  featureIcon: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
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
    backgroundColor: "#2563eb",
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
    fontWeight: "600",
    color: "#111827",
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  departmentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  departmentCard: {
    width: (width - 60) / 2,
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  departmentName: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
    marginTop: 8,
  },
  ctaSection: {
    backgroundColor: "#2563eb",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 30,
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
    color: "#2563eb",
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

export default LandingScreen;
