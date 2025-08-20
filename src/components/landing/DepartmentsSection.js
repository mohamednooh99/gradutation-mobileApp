import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";

const departmentImages = {
  education: require("../../../assets/images/education.jpeg"),
  electricity: require("../../../assets/images/electricity.jpeg"),
  health: require("../../../assets/images/health.jpeg"),
  higher_education: require("../../../assets/images/higher_education.jpeg"),
  housing: require("../../../assets/images/housing.jpeg"),
  interior: require("../../../assets/images/Interior.jpeg"),
  justice: require("../../../assets/images/justice.jpeg"),
  supply: require("../../../assets/images/supply.jpeg"),
  transport: require("../../../assets/images/transport.jpeg"),
  water: require("../../../assets/images/water.png"),
};

const DepartmentsSection = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const departments = [
    { name: "وزارة التعليم", image: departmentImages.education },
    { name: "وزارة الكهرباء", image: departmentImages.electricity },
    { name: "وزارة الصحة", image: departmentImages.health },
    { name: "وزارة التعليم العالي", image: departmentImages.higher_education },
    { name: "وزارة الإسكان", image: departmentImages.housing },
    { name: "وزارة الداخلية", image: departmentImages.interior },
    { name: "وزارة العدل", image: departmentImages.justice },
    { name: "وزارة التموين", image: departmentImages.supply },
    { name: "وزارة النقل", image: departmentImages.transport },
    { name: "وزارة المياه", image: departmentImages.water },
  ];

  const loopedDepartments = [...departments, ...departments, ...departments];

  useEffect(() => {
    const startAutoScroll = () => {
      const imageWidth = 120 + 30;
      const totalWidth = departments.length * imageWidth;

      Animated.loop(
        Animated.timing(scrollX, {
          toValue: -totalWidth,
          duration: 40000,
          useNativeDriver: true,
        })
      ).start();
    };

    const timer = setTimeout(startAutoScroll, 1000);
    return () => clearTimeout(timer);
  }, [scrollX, departments.length]);

  return (
    <View style={styles.departmentsSection}>
      <Text style={styles.departmentsSectionTitle}>
        الجهات المشاركة في المنصة
      </Text>

      <View style={styles.departmentsScrollView}>
        <Animated.View
          style={[
            styles.departmentsContainer,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          {loopedDepartments.map((dept, index) => (
            <View key={index} style={styles.departmentImageContainer}>
              <Image source={dept.image} style={styles.departmentImage} />
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  departmentsSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    marginTop: 2,
  },
  departmentsSectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183b4e",
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  departmentsScrollView: {
    overflow: "hidden",
    height: 140,
  },
  departmentsContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  departmentImageContainer: {
    marginHorizontal: 15,
  },
  departmentImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#27548a",
  },
});

export default DepartmentsSection;
