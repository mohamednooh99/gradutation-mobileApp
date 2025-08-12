import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import LandingScreen from "../components/landing/landing";

export default function Home({ navigation }) {
  return <LandingScreen navigation={navigation} />;
}
