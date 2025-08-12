// SplashScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>مرحبا بك</Text>
        <Text style={styles.subtitle}>هذا هو تطبيقنا الرائع</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
