import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase/firebase";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  compressImage,
  uploadImageAndGetUrl,
  uploadVideoAndGetUrl,
} from "../services/storage/imageHelpers";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("الاسم مطلوب"),
  email: Yup.string()
    .required("البريد الإلكتروني مطلوب")
    .email("من فضلك أدخل بريدًا إلكترونيًا صحيحًا"),
  governorate: Yup.string().required("المحافظة مطلوبة"),
  ministry: Yup.string().required("الوزارة مطلوبة"),
  description: Yup.string().required("ادخال الوصف مطلوب"),
});

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "القليوبية",
  "الغربية",
  "المنوفية",
  "البحيرة",
  "كفر الشيخ",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "بني سويف",
  "الفيوم",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "الوادي الجديد",
  "مطروح",
  "البحر الأحمر",
];

const MINISTRIES = [
  "إدارة الكهرباء والطاقة",
  "إدارة الغاز الطبيعي",
  "إدارة الطرق والكباري",
  "إدارة المرور",
  "إدارة النقل والمواصلات العامة",
  "مديرية الصحة",
  "إدارة البيئة ومكافحة التلوث",
  "مديرية التربية والتعليم",
  "مديرية الإسكان والمرافق",
  "إدارة التخطيط العمراني",
  "إدارة الأراضي وأملاك الدولة",
  "مديرية الأمن",
  "إدارة الدفاع المدني والحريق",
  "إدارة التموين والتجارة الداخلية",
  "إدارة حماية المستهلك",
  "إدارة الزراعة",
  "إدارة الري والموارد المائية",
  "إدارة الشباب والرياضة",
  "إدارة الثقافة",
  "إدارة السياحة والآثار",
];

function generateComplaintId() {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
}

export default function ComplaintForm() {
  const [showModal, setShowModal] = useState(false);
  const [newComplaintId, setNewComplaintId] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      governorate: "",
      ministry: "",
      description: "",
      imageUri: "",
      videoUri: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const complaintId = generateComplaintId();
      try {
        let imageUrl = null;
        let videoUrl = null;

        // Upload image if selected
        if (values.imageUri) {
          try {
            console.log("Starting image upload...");
            imageUrl = await uploadImageAndGetUrl(values.imageUri, complaintId);
            console.log("Image uploaded successfully:", imageUrl);
          } catch (imageError) {
            console.error("Image upload failed:", imageError);
            Alert.alert("خطأ", "فشل في رفع الصورة. يرجى المحاولة مرة أخرى.");
            return;
          }
        }

        // Upload video if selected
        if (values.videoUri) {
          try {
            console.log("Starting video upload...");
            videoUrl = await uploadVideoAndGetUrl(values.videoUri, complaintId);
            console.log("Video uploaded successfully:", videoUrl);
          } catch (videoError) {
            console.error("Video upload failed:", videoError);
            Alert.alert("خطأ", "فشل في رفع الفيديو. يرجى المحاولة مرة أخرى.");
            return;
          }
        }

        console.log("Saving complaint to Firestore...");
        await addDoc(collection(db, "complaints"), {
          name: values.name,
          email: values.email,
          governorate: values.governorate,
          ministry: values.ministry,
          description: values.description,
          imageUrl,
          videoUrl,
          createdAt: serverTimestamp(),
          status: "قيد المعالجة",
          complaintId,
        });

        setNewComplaintId(complaintId);
        setShowModal(true);
        resetForm();
        setVideoPreview(null);
        setVideoFileName(null);
      } catch (e) {
        console.error("خطأ أثناء إرسال الشكوى:", e);
        Alert.alert(
          "خطأ",
          "حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Request permissions for media library
  const requestMediaLibraryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }, []);

  // Pick image from gallery
  const pickImage = useCallback(async () => {
    const granted = await requestMediaLibraryPermission();
    if (!granted) {
      Alert.alert("خطأ", "لم يتم منح صلاحية الوصول للصور");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        formik.setFieldValue("imageUri", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصورة");
    }
  }, [formik, requestMediaLibraryPermission]);

  // Pick video from gallery
  const pickVideo = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        if (result.size > 20 * 1024 * 1024) {
          Alert.alert("خطأ", "حجم الفيديو يجب أن يكون أقل من 20 ميجابايت");
          return;
        }

        formik.setFieldValue("videoUri", result.uri);
        setVideoPreview(result.uri);
        setVideoFileName(result.name);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الفيديو");
    }
  }, [formik]);

  // Remove video
  const removeVideo = useCallback(() => {
    formik.setFieldValue("videoUri", "");
    setVideoPreview(null);
    setVideoFileName(null);
  }, [formik]);

  const isRTL = I18nManager.isRTL;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>قدم شكوتك</Text>

        <View style={styles.field}>
          <Text style={styles.label}>الاسم</Text>
          <TextInput
            style={styles.input}
            placeholder="من فضلك ادخل الاسم"
            value={formik.values.name}
            onChangeText={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            textAlign={isRTL ? "right" : "left"}
          />
          {formik.touched.name && formik.errors.name ? (
            <Text style={styles.error}>{formik.errors.name}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput
            style={styles.input}
            placeholder="من فضلك ادخل بريدك الالكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            textAlign={isRTL ? "right" : "left"}
          />
          {formik.touched.email && formik.errors.email ? (
            <Text style={styles.error}>{formik.errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>اختر المحافظة</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formik.values.governorate}
              onValueChange={(v) => formik.setFieldValue("governorate", v)}
            >
              <Picker.Item label="اختر المحافظة" value="" enabled={false} />
              {GOVERNORATES.map((g) => (
                <Picker.Item key={g} label={g} value={g} />
              ))}
            </Picker>
          </View>
          {formik.touched.governorate && formik.errors.governorate ? (
            <Text style={styles.error}>{formik.errors.governorate}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>اختر الإدارة المختصة</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formik.values.ministry}
              onValueChange={(v) => formik.setFieldValue("ministry", v)}
            >
              <Picker.Item label="اختر الإدارة" value="" enabled={false} />
              {MINISTRIES.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker> 
          </View>
          {formik.touched.ministry && formik.errors.ministry ? (
            <Text style={styles.error}>{formik.errors.ministry}</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>وصف الشكوى</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder="من فضلك ادخل تفاصيل الشكوى هنا..."
            value={formik.values.description}
            onChangeText={formik.handleChange("description")}
            onBlur={formik.handleBlur("description")}
            textAlignVertical="top"
            textAlign={isRTL ? "right" : "left"}
          />
          {formik.touched.description && formik.errors.description ? (
            <Text style={styles.error}>{formik.errors.description}</Text>
          ) : null}
        </View>

        {/* Image Upload Section */}
        <View style={styles.field}>
          <Text style={styles.label}>(اختياري) ارفق صورة الشكوى</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>اختر صورة من المعرض</Text>
          </TouchableOpacity>

          {formik.values.imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: formik.values.imageUri }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => formik.setFieldValue("imageUri", "")}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          )}

          {formik.values.imageUri && (
            <Text style={styles.helper}>تم تحميل الصورة بنجاح</Text>
          )}
        </View>

        {/* Video Upload Section */}
        <View style={styles.field}>
          <Text style={styles.label}>(اختياري) ارفق فيديو الشكوى</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
            <Text style={styles.uploadButtonText}>اختر ملف فيديو</Text>
          </TouchableOpacity>

          {isUploadingVideo && (
            <Text style={styles.helper}>جاري رفع الفيديو...</Text>
          )}

          {videoPreview && (
            <View style={styles.videoPreviewContainer}>
              <View style={styles.videoThumbnail}>
                <Text style={styles.videoIcon}>🎥</Text>
                <Text style={styles.videoLabel}>فيديو محدد</Text>
              </View>
              <View style={styles.videoInfoContainer}>
                <Text style={styles.videoFileName}>{videoFileName}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeVideo}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.helper}>الحد الأقصى لحجم الفيديو: 20MB</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, formik.isSubmitting && styles.buttonDisabled]}
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          <Text style={styles.buttonText}>
            {formik.isSubmitting ? "جارٍ الإرسال..." : "إرسال الشكوى"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>شكراً لك!</Text>
            <Text style={styles.modalText}>تم إرسال الشكوى بنجاح</Text>
            <Text style={styles.modalTextStrong}>رقم الشكوى الخاص بك:</Text>
            <Text style={styles.modalId}>{newComplaintId}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>تم</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#f5f6f8",
    flexGrow: 1,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f3b5f",
    textAlign: I18nManager.isRTL ? "right" : "left",
    marginBottom: 12,
  },
  field: { marginBottom: 14 },
  label: { color: "#0f3b5f", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
  },
  textArea: { minHeight: 120 },
  pickerWrapper: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
  },
  error: { color: "#dc2626", marginTop: 6 },
  helper: { color: "#6b7280", marginTop: 6 },
  uploadButton: {
    backgroundColor: "#e5e7eb",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 8,
  },
  uploadButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  videoPreviewContainer: {
    marginTop: 12,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
  },
  videoThumbnail: {
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 20,
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoLabel: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  videoInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  videoFileName: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: "#dc2626",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 360,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#047857",
    marginBottom: 8,
  },
  modalText: { color: "#111827", marginBottom: 6, textAlign: "center" },
  modalTextStrong: {
    color: "#1d4ed8",
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  modalId: { fontSize: 18 },
});
