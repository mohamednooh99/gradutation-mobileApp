import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { I18nManager, StyleSheet } from "react-native";
import { useFonts, Tajawal_400Regular } from "@expo-google-fonts/tajawal";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({ Tajawal_400Regular });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function enableRTL() {
      // if (!fontsLoaded) return;
      if (!I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      } else {
        setReady(true);
      }
    }
    if (fontsLoaded) {
      enableRTL();
    }
  }, [fontsLoaded]);

  // if (!fontsLoaded || !ready) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 16,
    paddingEnd: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 10,
  },
});
