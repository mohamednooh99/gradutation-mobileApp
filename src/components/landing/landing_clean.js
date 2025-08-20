import React from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";

// Import separate components
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import DepartmentsSection from './DepartmentsSection';
import AboutSection from './AboutSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

const LandingScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <HeroSection navigation={navigation} />
      <FeaturesSection />
      <HowItWorksSection />
      <DepartmentsSection />
      <AboutSection />
      <FAQSection />
      <CTASection navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default LandingScreen;
