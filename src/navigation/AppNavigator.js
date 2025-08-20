import React, { memo, useCallback } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, StyleSheet, I18nManager } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from "../pages/Home";
import SplashScreen from "../components/screens/splashScreen/SplashScreen";
import LoginScreen from "../pages/Login";
import SignUp from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import { useAuth } from "../contexts/AuthContext";
import ComplaintForm from "../pages/ComplaintForm";
import ComplaintHistory from "../pages/ComplaintHistory";
import Profile from "../pages/Profile";

// Route and label constants
const ROUTES = {
  Home: "الرئيسية",
  Splash: "Splash",
  Login: "Login",
  Signup: "Signup",
  ResetPassword: "ResetPassword",
  Complaint: "Complaint",
  ComplaintHistory: "ComplaintHistory",
  Profile: "Profile",
};

const LABELS_AR = {
  hello: "مرحباً",
  home: "الرئيسية",
  logout: "تسجيل الخروج",
  complaintHistory: "سجل الشكاوي",
  profile: "الملف الشخصي",
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

  const navigateComplaintHistory = useCallback(() => {
    navigation.navigate(ROUTES.ComplaintHistory);
  }, [navigation]);

  const navigateProfile = useCallback(() => {
    navigation.navigate(ROUTES.Profile);
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
        <View style={styles.avatarContainer}>
          <Icon name="user-circle" size={60} color="#27548A" />
        </View>
        <Text style={styles.drawerHeaderText}>
          {currentUser?.displayName || 'المستخدم'}
        </Text>
        <Text style={styles.drawerSubText}>
          {currentUser?.email || LABELS_AR.hello}
        </Text>
      </View>
      
      <View style={styles.menuSection}>
        <DrawerItem
          style={styles.drawerItem}
          label={() => (
            <View style={styles.menuItemContainer}>
              <Icon name="home" size={20} color="#27548A" style={styles.menuIcon} />
              <Text style={styles.drawerItemText}>{LABELS_AR.home}</Text>
            </View>
          )}
          onPress={navigateHome}
        />

        <DrawerItem
          style={styles.drawerItem}
          label={() => (
            <View style={styles.menuItemContainer}>
              <Icon name="history" size={20} color="#27548A" style={styles.menuIcon} />
              <Text style={styles.drawerItemText}>{LABELS_AR.complaintHistory}</Text>
            </View>
          )}
          onPress={navigateComplaintHistory}
        />

        <DrawerItem
          style={styles.drawerItem}
          label={() => (
            <View style={styles.menuItemContainer}>
              <Icon name="user" size={20} color="#27548A" style={styles.menuIcon} />
              <Text style={styles.drawerItemText}>{LABELS_AR.profile}</Text>
            </View>
          )}
          onPress={navigateProfile}
        />
      </View>
      
      <View style={styles.logoutSection}>
        <DrawerItem
          style={[styles.drawerItem, styles.logoutItem]}
          label={() => (
            <View style={styles.menuItemContainer}>
              <Icon name="sign-out" size={20} color="#DC2626" style={styles.menuIcon} />
              <Text style={[styles.drawerItemText, styles.logoutText]}>{LABELS_AR.logout}</Text>
            </View>
          )}
          onPress={handleLogout}
        />
      </View>
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
      <Drawer.Screen
        name={ROUTES.ComplaintHistory}
        component={ComplaintHistory}
        options={{ title: "سجل الشكاوي" }}
      />
      <Drawer.Screen
        name={ROUTES.Profile}
        component={Profile}
        options={{ title: "الملف الشخصي" }}
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
    backgroundColor: "#F5F5F5",
  },
  drawerHeader: {
    backgroundColor: "#27548A",
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  avatarContainer: {
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 10,
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: 'Tajawal',
    marginBottom: 5,
  },
  drawerSubText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontFamily: 'Tajawal',
  },
  menuSection: {
    paddingTop: 20,
  },
  drawerItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  menuIcon: {
    marginHorizontal: 15,
  },
  drawerItemText: {
    fontSize: 16,
    color: "#1F2937",
    fontFamily: 'Tajawal',
    fontWeight: '500',
  },
  logoutSection: {
    marginTop: 'auto',
    paddingBottom: 30,
  },
  logoutItem: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  drawer: {
    backgroundColor: "#F5F5F5",
    width: 280,
  },
});
