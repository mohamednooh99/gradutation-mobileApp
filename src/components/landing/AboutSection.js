import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AboutSection = () => {
  const problems = [
    "معاناة المواطنين من مشاكل مستمرة في الخدمات اليومية (مياه– كهرباء– طرق...)",
    "عدم وجود نظام موحد لتقديم الشكاوى أو الاقتراحات",
    "عدم وجود وسيلة واضحة للمتابعة بعد تقديم الشكوى",
    "الجهات الحكومية لا تمتلك أدوات لتحليل البيانات وتحسين الخدمات",
  ];

  const solutions = [
    "منصة رقمية تمكِّن المواطن من تقديم الشكاوى والاقتراحات بسهولة",
    "ربط تلقائي بين الشكوى والجهة المختصة حسب نوعها وموقعها",
    "إتاحة الردود من الجهات مع إشعارات ومتابعة الحالة",
    "توفير لوحة تحكم لكل من المستخدم، والجهة، والمشرف العام",
  ];

  const dashboardFeatures = [
    "عرض شامل لكل الشكاوى الخاصة بالجهة",
    "إمكانية الرد المباشر على الشكاوى",
    "تحديث حالة الشكوى (جاري الحل – تم الحل – مغلقة)",
    "فلاتر وتصنيفات حسب الفئة، الوقت، أو الحالة",
    "بحث سريع وسهل داخل الـ DataTable",
    "تقارير وتحليلات تساعد في تحسين الأداء العام",
  ];

  const dashboardEmojis = ["🗂️", "💬", "🔄", "⏳", "🔍", "📈"];

  return (
    <View style={styles.aboutSection}>
      <Text style={styles.aboutSectionTitle}>عن منصة شكوتك</Text>

      <View style={styles.aboutCardsContainer}>
        {/* Problem Card */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutCardHeader}>
            <View
              style={[styles.aboutIconContainer, styles.problemIconContainer]}
            >
              <Icon name="warning" size={20} color="#dc2626" />
            </View>
            <Text style={[styles.aboutCardTitle, styles.problemTitle]}>
              المشكلة الأساسية
            </Text>
          </View>
          <View style={styles.aboutCardContent}>
            {problems.map((problem, index) => (
              <View key={index} style={styles.aboutListItem}>
                <Icon
                  name="error-outline"
                  size={16}
                  color="#dc2626"
                  style={styles.aboutListIcon}
                />
                <Text style={styles.aboutListText}>{problem}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Solution Card */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutCardHeader}>
            <View
              style={[styles.aboutIconContainer, styles.solutionIconContainer]}
            >
              <Icon name="lightbulb-outline" size={20} color="#16a34a" />
            </View>
            <Text style={[styles.aboutCardTitle, styles.solutionTitle]}>
              الحل المقترح
            </Text>
          </View>
          <View style={styles.aboutCardContent}>
            {solutions.map((solution, index) => (
              <View key={index} style={styles.aboutListItem}>
                <Icon
                  name="check-circle-outline"
                  size={16}
                  color="#16a34a"
                  style={styles.aboutListIcon}
                />
                <Text style={styles.aboutListText}>{solution}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Dashboard Features */}
      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardTitle}>
          مميزات لوحة التحكم الخاصة بالجهة
        </Text>
        <View style={styles.dashboardGrid}>
          {dashboardFeatures.map((feature, index) => (
            <View key={index} style={styles.dashboardListItem}>
              <Text style={styles.dashboardEmoji}>
                {dashboardEmojis[index]}
              </Text>
              <Text style={styles.dashboardListText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutSection: {
    backgroundColor: "#f5eedc",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 2,
  },
  aboutSectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183b4e",
    textAlign: "center",
    marginBottom: 30,
  },
  aboutCardsContainer: {
    marginBottom: 30,
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  aboutCardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  aboutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  problemIconContainer: {
    backgroundColor: "#fecaca",
  },
  solutionIconContainer: {
    backgroundColor: "#bbf7d0",
  },
  aboutCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  problemTitle: {
    color: "#dc2626",
    marginRight: 5,
  },
  solutionTitle: {
    color: "#16a34a",
    marginRight: 5,
  },
  aboutCardContent: {
    gap: 12,
  },
  aboutListItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  aboutListIcon: {
    marginLeft: 12,
    marginTop: 2,
  },
  aboutListText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  dashboardCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8",
    textAlign: "center",
    marginBottom: 20,
  },
  dashboardGrid: {
    gap: 12,
  },
  dashboardListItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  dashboardEmoji: {
    fontSize: 16,
    marginLeft: 12,
    marginTop: 2,
  },
  dashboardListText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
});

export default AboutSection;

// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
// import Animated, {
//   FadeInUp,
//   withTiming,
//   useSharedValue,
//   useAnimatedStyle,
// } from "react-native-reanimated";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// export default function AboutSection() {
//   // Animation State
//   const opacity = useSharedValue(0);
//   const translateY = useSharedValue(40);

//   // Animation Setup
//   useEffect(() => {
//     opacity.value = withTiming(1, { duration: 600 });
//     translateY.value = withTiming(0, { duration: 600 });
//   }, []);

//   // Animated Style
//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//     transform: [{ translateY: translateY.value }],
//   }));

//   // Data for FlatLists
//   const problemData = [
//     "معاناة المواطنين من مشاكل مستمرة في الخدمات اليومية (مياه– كهرباء– طرق...)",
//     "عدم وجود نظام موحد لتقديم الشكاوى أو الاقتراحات",
//     "عدم وجود وسيلة واضحة للمتابعة بعد تقديم الشكوى",
//     "الجهات الحكومية لا تمتلك أدوات لتحليل البيانات وتحسين الخدمات",
//   ];

//   const solutionData = [
//     "منصة رقمية تمكِّن المواطن من تقديم الشكاوى والاقتراحات بسهولة",
//     "ربط تلقائي بين الشكوى والجهة المختصة حسب نوعها وموقعها",
//     "إتاحة الردود من الجهات مع إشعارات ومتابعة الحالة",
//     "توفير لوحة تحكم لكل من المستخدم، والجهة، والمشرف العام",
//   ];

//   const dashboardData = [
//     "عرض شامل لكل الشكاوى الخاصة بالجهة",
//     "إمكانية الرد المباشر على الشكاوى",
//     "تحديث حالة الشكوى (جاري الحل – تم الحل – مغلقة)",
//     "فلاتر وتصنيفات حسب الفئة، الوقت، أو الحالة",
//     "بحث سريع وسهل داخل الـ DataTable",
//     "تقارير وتحليلات تساعد في تحسين الأداء العام",
//   ];

//   // Render Item for FlatList
//   const renderProblemItem = ({ item }) => (
//     <View style={styles.listItem}>
//       <Text style={styles.listText}>{`\u2022 ${item}`}</Text>
//     </View>
//   );

//   const renderSolutionItem = ({ item }) => (
//     <View style={styles.listItem}>
//       <Text style={styles.listText}>{`\u2022 ${item}`}</Text>
//     </View>
//   );

//   const renderDashboardItem = ({ item }) => (
//     <Text style={styles.listText}>{`\u2022 ${item}`}</Text>
//   );

//   return (
//     <View
//       style={styles.container}
//       accessible={true}
//       accessibilityLabel="عن منصة شكوتك"
//     >
//       <Animated.View style={[styles.content, animatedStyle]}>
//         {/* Section Title */}
//         <Text style={styles.title}>عن منصة شكوتك</Text>

//         {/* Problem & Solution Section */}
//         <View style={styles.grid}>
//           {/* Problem Card */}
//           <Animated.View
//             style={styles.card}
//             entering={FadeInUp.duration(600).delay(200)}
//           >
//             <View style={styles.cardHeader}>
//               <View style={styles.iconWrapper}>
//                 <AntDesign name="warning" size={24} color="red" />
//               </View>
//               <Text style={styles.cardTitle}>المشكلة الأساسية</Text>
//             </View>
//             <FlatList
//               data={problemData}
//               renderItem={renderProblemItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.list}
//               contentContainerStyle={styles.listContent}
//             />
//           </Animated.View>

//           {/* Solution Card */}
//           <Animated.View
//             style={styles.card}
//             entering={FadeInUp.duration(600).delay(400)}
//           >
//             <View style={styles.cardHeader}>
//               <View
//                 style={[styles.iconWrapper, { backgroundColor: "#bbf7d0ff" }]}
//               >
//                 <MaterialCommunityIcons
//                   name="head-lightbulb"
//                   size={24}
//                   color="#29AB59"
//                 />
//               </View>
//               <Text style={styles.cardTitle}>الحل المقترح</Text>
//             </View>
//             <FlatList
//               data={solutionData}
//               renderItem={renderSolutionItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.list}
//               contentContainerStyle={styles.listContent}
//             />
//           </Animated.View>

//           {/* Dashboard Section */}

//           <Animated.View
//             style={styles.card}
//             entering={FadeInUp.duration(600).delay(600)}
//           >
//             <View style={styles.cardHeader}>
//               <View
//                 style={[styles.iconWrapper, { backgroundColor: "#fff9c479" }]}
//               >
//                 <MaterialCommunityIcons
//                   name="star-plus-outline"
//                   size={24}
//                   color="yellow"
//                 />
//               </View>
//               <Text style={styles.cardTitle}>
//                 مميزات لوحة التحكم الخاصة بالجهة
//               </Text>
//             </View>
//             <FlatList
//               data={dashboardData}
//               renderItem={renderDashboardItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.list}
//               contentContainerStyle={styles.listContent}
//             />
//           </Animated.View>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 40,
//     backgroundColor: "#E6F0FA",
//     paddingHorizontal: 10,
//     // direction: "rtl", // Enable RTL for Arabic
//   },
//   content: {
//     maxWidth: Dimensions.get("window").width > 768 ? 960 : "100%",
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#27548a",
//     textAlign: "center",
//     marginBottom: 20,
//     fontFamily: "Arial", // Optional: Use an Arabic-compatible font
//   },
//   grid: {
//     flexDirection: "column",
//     gap: 20, // Gap between cards
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginVertical: 10,
//   },
//   cardHeader: {
//     flexDirection: "row-reverse",
//     alignItems: "right",
//     marginBottom: 20,
//   },
//   iconWrapper: {
//     backgroundColor: "#FEE2E2",
//     borderRadius: 20,
//     padding: 6,
//     marginLeft: 10,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#27548a",
//     textAlign: "right",
//     flex: 1,
//   },
//   list: {
//     gap: 15,
//   },
//   listContent: {
//     paddingBottom: 10,
//   },
//   listItem: {
//     flexDirection: "row-reverse",
//     alignItems: "flex-start",
//   },
//   listText: {
//     fontSize: 16,
//     color: "#4B5563",
//     lineHeight: 24,
//     flexShrink: 1,
//     textAlign: "right",
//   },
// });
