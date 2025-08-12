import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  I18nManager,
  Platform,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail } = useAuth();

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle();
      Alert.alert("نجح", "تم تسجيل الدخول باستخدام جوجل 🎉");
      // Navigation will be handled by auth state change
    } catch (error) {
      setError("فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.");
      Alert.alert("خطأ", "فشل تسجيل الدخول باستخدام جوجل ❌");
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email/Password Login
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const userCredential = await signInWithEmail(email, password);
      const user = userCredential.user;

      // Check user role and navigate accordingly
      // Note: User data will be available in AuthContext after auth state change
      Alert.alert("نجح", "تم تسجيل الدخول بنجاح 🎉");
    } catch (err) {
      let errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة ❌";

      if (err.code === "auth/user-not-found") {
        errorMessage = "لم يتم العثور على هذا المستخدم";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "كلمة المرور غير صحيحة";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "البريد الإلكتروني غير صالح";
      }

      setError(errorMessage);
      Alert.alert("خطأ", errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = I18nManager.isRTL;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>تسجيل الدخول</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput
              style={styles.input}
              placeholder="البريد الإلكتروني"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign={isRTL ? "right" : "left"}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>كلمة المرور</Text>
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign={isRTL ? "right" : "left"}
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>
              تسجيل الدخول باستخدام جوجل
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>ليس لديك حساب؟ </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupLink}>إنشاء حساب جديد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f6f8",
    padding: 16,
    paddingTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f3b5f",
    textAlign: "center",
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6b7280",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#6b7280",
    fontSize: 14,
  },
  signupLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Login;
