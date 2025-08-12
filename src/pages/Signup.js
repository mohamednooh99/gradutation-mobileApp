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

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signUpWithEmail } = useAuth();

  // Handle Google Sign-Up
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      Alert.alert("نجح", "تم إنشاء الحساب باستخدام جوجل 🎉");
      // Navigation will be handled by auth state change
    } catch (error) {
      Alert.alert(
        "خطأ",
        "فشل إنشاء الحساب باستخدام جوجل. يرجى المحاولة مرة أخرى."
      );
      console.error("Google sign-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
    }

    // National ID validation
    if (!formData.nationalId) {
      newErrors.nationalId = "الرقم القومي مطلوب";
    } else if (!/^\d{14}$/.test(formData.nationalId)) {
      newErrors.nationalId = "يجب أن يتكون الرقم القومي من 14 رقمًا";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^01[0125]\d{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم هاتف غير صالح";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (field, value) => {
    // Prevent non-numeric input for nationalId and phone
    if (
      (field === "nationalId" || field === "phone") &&
      value !== "" &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle form submission
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Create user with email and password
      await signUpWithEmail(formData.email, formData.password, {
        name: formData.name,
        nationalId: formData.nationalId,
        phone: formData.phone,
        email: formData.email,
      });

      Alert.alert("نجح", "تم إنشاء الحساب بنجاح 🎉");
      navigation.navigate("Login");
    } catch (err) {
      let errorMessage = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "البريد الإلكتروني مستخدم بالفعل";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "كلمة المرور ضعيفة جداً";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "البريد الإلكتروني غير صالح";
      }

      Alert.alert("خطأ", errorMessage);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = I18nManager.isRTL;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>إنشاء حساب جديد</Text>

        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>الاسم الكامل</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="الاسم الكامل"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              textAlign={isRTL ? "right" : "left"}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* National ID Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>الرقم القومي</Text>
            <TextInput
              style={[styles.input, errors.nationalId && styles.inputError]}
              placeholder="الرقم القومي (14 رقم)"
              value={formData.nationalId}
              onChangeText={(value) => handleChange("nationalId", value)}
              keyboardType="numeric"
              maxLength={14}
              textAlign={isRTL ? "right" : "left"}
            />
            {errors.nationalId && (
              <Text style={styles.errorText}>{errors.nationalId}</Text>
            )}
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>رقم الهاتف</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="رقم الهاتف (11 رقم)"
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="numeric"
              maxLength={11}
              textAlign={isRTL ? "right" : "left"}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign={isRTL ? "right" : "left"}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>كلمة المرور</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry
              textAlign={isRTL ? "right" : "left"}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>تأكيد كلمة المرور</Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="تأكيد كلمة المرور"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              secureTextEntry
              textAlign={isRTL ? "right" : "left"}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-Up Button */}
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>التسجيل باستخدام جوجل</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>لديك حساب بالفعل؟ </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>تسجيل الدخول</Text>
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
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "right",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#6b7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Signup;
