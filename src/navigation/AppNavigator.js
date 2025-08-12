import React, { memo, useCallback } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, StyleSheet, I18nManager } from "react-native";
import Home from "../pages/Home";
import SplashScreen from "../components/screens/splashScreen/SplashScreen";
import LoginScreen from "../pages/Login";
import SignUp from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import { useAuth } from "../contexts/AuthContext";
import ComplaintForm from "../pages/ComplaintForm";

// Route and label constants
const ROUTES = {
  Home: "Home",
  Splash: "Splash",
  Login: "Login",
  Signup: "Signup",
  ResetPassword: "ResetPassword",
  Complaint: "Complaint",
};

const LABELS_AR = {
  hello: "مرحباً",
  home: "الرئيسية",
  logout: "تسجيل الخروج",
};

// Create navigators at module scope to avoid re-creation
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content with Logout Button
const CustomDrawerContent = memo(function CustomDrawerContent({
  navigation,
  ...props
}) {
  const { logout, currentUser } = useAuth();

  const navigateHome = useCallback(() => {
    navigation.navigate(ROUTES.Home);
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      // Close the drawer immediately for better UX; auth state switch will handle navigation
      navigation.closeDrawer?.();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>
          {currentUser ? currentUser.email : LABELS_AR.hello}
        </Text>
      </View>
      <DrawerItem
        style={styles.drawerItem}
        label={LABELS_AR.home}
        labelStyle={styles.drawerItemText}
        onPress={navigateHome}
      />

      <DrawerItem
        style={styles.drawerItem}
        label={LABELS_AR.logout}
        labelStyle={styles.drawerItemText}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
});

// Auth Stack for unauthenticated users
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.Splash}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.Splash} component={SplashScreen} />
      <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
      <Stack.Screen name={ROUTES.Signup} component={SignUp} />
      <Stack.Screen name={ROUTES.ResetPassword} component={ResetPassword} />
    </Stack.Navigator>
  );
};

// App Stack for authenticated users
const AppStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerPosition: I18nManager.isRTL ? "right" : "left",
        drawerStyle: styles.drawer,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={ROUTES.Home} component={Home} />
      <Drawer.Screen
        name={ROUTES.Complaint}
        component={ComplaintForm}
        options={{ title: "تقديم شكوى" }}
      />
    </Drawer.Navigator>
  );
};

// Main Navigator
export default function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <SplashScreen />; // Show splash while checking auth state
  }

  return currentUser ? <AppStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 40,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  drawerItemText: {
    fontSize: 16,
    color: "#374151",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  drawer: {
    backgroundColor: "#fff",
    width: 250,
  },
});
