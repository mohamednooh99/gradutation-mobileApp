import React, { useMemo, useState, useCallback, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase/firebase";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from 'expo-location';
import { Picker } from "@react-native-picker/picker";

// Platform-specific map imports
import { MapView, Marker } from '../utils/mapUtils';
import {
  compressImage,
  uploadImageAndGetUrl,
  uploadVideoAndGetUrl,
} from "../services/storage/imageHelpers";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("الاسم مطلوب"),
  email: Yup.string()
    .required("البريد الإلكتروني مطلوب")
    .email("من فضلك أدخل بريدًا إلكترونيًا صحيحًا"),
  governorate: Yup.string().required("المحافظة مطلوبة"),
  ministry: Yup.string().required("الإدارة المختصة مطلوبة"),
  description: Yup.string()
    .required("ادخال الوصف مطلوب")
    .min(20, "الوصف يجب أن يكون على الأقل 20 حرفًا"),
  location: Yup.string().required("الموقع مطلوب"),
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
  const { currentUser, userData } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newComplaintId, setNewComplaintId] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      governorate: "",
      ministry: "",
      description: "",
      imageUri: "",
      imageBase64: "",
      videoUri: "",
      location: { latitude: null, longitude: null },
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const complaintId = generateComplaintId();
      try {
        let imageUrl = null;
        let videoUrl = null;

        // Use base64 image data if available
        if (values.imageBase64) {
          console.log("Using base64 image data");
          imageUrl = values.imageBase64;
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
          administration: values.ministry,
          description: values.description,
          imagesBase64: imageUrl ? [imageUrl] : [],
          videoUrl,
          location: values.location,
          createdAt: serverTimestamp(),
          status: "قيد المعالجة",
          complaintId,
          userId: currentUser?.uid || null,
        });

        setNewComplaintId(complaintId);
        setShowModal(true);
        resetForm();
        setVideoPreview(null);
        setVideoFileName(null);
        setSelectedLocation(null);
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
    try {
      // Check if we need permissions (mobile platforms)
      const granted = await requestMediaLibraryPermission();
      if (!granted) {
        Alert.alert("خطأ", "لم يتم منح صلاحية الوصول للصور");
        return;
      }

      console.log("Launching image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true, // Include base64 for direct storage
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        console.log("Selected image URI:", asset.uri);
        
        // Validate image size if available
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert("خطأ", "حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت.");
          return;
        }
        
        // Store both URI and base64 data
        formik.setFieldValue("imageUri", asset.uri);
        if (asset.base64) {
          formik.setFieldValue("imageBase64", `data:image/jpeg;base64,${asset.base64}`);
          console.log("Base64 data stored");
        }
      } else {
        console.log("Image selection was canceled or no URI found");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", `حدث خطأ أثناء اختيار الصورة: ${error.message}`);
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

  // Auto-fill user data when logged in
  useEffect(() => {
    if (currentUser && userData) {
      formik.setFieldValue("name", userData.name || currentUser.displayName || "");
      formik.setFieldValue("email", userData.email || currentUser.email || "");
    }
  }, [currentUser, userData]);

  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        try {
          let location = await Location.getCurrentPositionAsync({});
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
    })();
  }, []);

  // Handle map press to select location
  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
    formik.setFieldValue("location", `${coordinate.latitude},${coordinate.longitude}`);
  };

  // Get current location button handler
  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert("خطأ", "لم يتم منح صلاحية الوصول للموقع");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setSelectedLocation(coordinate);
      formik.setFieldValue("location", `${coordinate.latitude},${coordinate.longitude}`);
      setCurrentLocation({
        ...coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء الحصول على الموقع");
    }
  };

  const isRTL = I18nManager.isRTL;

  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>تقديم شكوى جديدة</Text>
          <Text style={styles.subtitle}>املأ النموذج أدناه لتقديم شكواك وسنقوم بمتابعتها</Text>
        </View>

        {/* الصف الأول: الاسم والبريد الإلكتروني */}
        <View style={[styles.row, isTablet && styles.tabletRow]}>
          <View style={[styles.field, isTablet && styles.halfField]}>
            <Text style={styles.label}>الاسم الكامل <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={currentUser ? [styles.input, styles.disabledInput] : [styles.input, formik.touched.name && formik.errors.name && styles.inputError]}
              placeholder="أدخل اسمك بالكامل"
              value={formik.values.name}
              onChangeText={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              textAlign={isRTL ? "right" : "left"}
              editable={!currentUser}
            />
            {formik.touched.name && formik.errors.name ? (
              <Text style={styles.error}>{formik.errors.name}</Text>
            ) : null}
          </View>

          <View style={[styles.field, isTablet && styles.halfField]}>
            <Text style={styles.label}>البريد الإلكتروني <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={currentUser ? [styles.input, styles.disabledInput] : [styles.input, formik.touched.email && formik.errors.email && styles.inputError]}
              placeholder="example@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              textAlign={isRTL ? "right" : "left"}
              editable={!currentUser}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text style={styles.error}>{formik.errors.email}</Text>
            ) : null}
          </View>
        </View>

        {/* الصف الثاني: المحافظة والإدارة */}
        <View style={[styles.row, isTablet && styles.tabletRow]}>
          <View style={[styles.field, isTablet && styles.halfField]}>
            <Text style={styles.label}>المحافظة <Text style={styles.required}>*</Text></Text>
            <View style={[styles.pickerWrapper, formik.touched.governorate && formik.errors.governorate && styles.inputError]}>
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

          <View style={[styles.field, isTablet && styles.halfField]}>
            <Text style={styles.label}>الإدارة المختصة <Text style={styles.required}>*</Text></Text>
            <View style={[styles.pickerWrapper, formik.touched.ministry && formik.errors.ministry && styles.inputError]}>
              <Picker
                selectedValue={formik.values.ministry}
                onValueChange={(v) => formik.setFieldValue("ministry", v)}
              >
                <Picker.Item label="اختر الإدارة المختصة" value="" enabled={false} />
                {MINISTRIES.map((m) => (
                  <Picker.Item key={m} label={m} value={m} />
                ))}
              </Picker> 
            </View>
            {formik.touched.ministry && formik.errors.ministry ? (
              <Text style={styles.error}>{formik.errors.ministry}</Text>
            ) : null}
          </View>
        </View>

        {/* وصف الشكوى */}
        <View style={styles.field}>
          <Text style={styles.label}>تفاصيل الشكوى <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea, formik.touched.description && formik.errors.description && styles.inputError]}
            multiline
            numberOfLines={5}
            placeholder="صف شكواك بالتفصيل (20 حرف على الأقل)..."
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

        {/* رفع الصور والفيديو */}
        <View style={styles.field}>
          <Text style={styles.label}>إرفاق صورة أو فيديو (اختياري)</Text>
          
          {/* أزرار الرفع */}
          <View style={styles.uploadRow}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Icon name="upload" size={24} color="#9CA3AF" style={styles.uploadIcon} />
              <Text style={styles.uploadButtonText}>اضغط لرفع صورة</Text>
              <Text style={styles.uploadSubtext}>الصور فقط (بحد أقصى 2MB)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
              <Icon name="upload" size={24} color="#9CA3AF" style={styles.uploadIcon} />
              <Text style={styles.uploadButtonText}>اضغط لرفع فيديو</Text>
              <Text style={styles.uploadSubtext}>بحد أقصى 20MB</Text>
            </TouchableOpacity>
          </View>

          {/* عرض الصور والفيديو */}
          <View style={styles.mediaGrid}>
            {/* الصور */}
            {formik.values.imageUri && (
              <View style={styles.mediaPreviewContainer}>
                <Image
                  source={{ uri: formik.values.imageUri }}
                  style={styles.mediaPreview}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => formik.setFieldValue("imageUri", "")}
                >
                  <Icon name="times" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* الفيديو */}
            {videoPreview && (
              <View style={styles.mediaPreviewContainer}>
                <View style={styles.videoPreview}>
                  <Icon name="play-circle" size={40} color="#fff" />
                  <Text style={styles.videoLabel}>فيديو</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeVideo}
                >
                  <Icon name="times" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isUploadingVideo && (
            <Text style={styles.helper}>جاري رفع الفيديو...</Text>
          )}
        </View>

        {/* الخريطة */}
        <View style={styles.field}>
          <Text style={styles.label}>موقع الشكوى <Text style={styles.required}>*</Text></Text>
          
          {MapView ? (
            // Native mobile and web map
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={currentLocation || {
                  latitude: 30.0444,
                  longitude: 31.2357,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                }}
                onPress={handleMapPress}
                showsUserLocation={locationPermission}
                showsMyLocationButton={false}
              >
                {selectedLocation && (
                  <Marker
                    coordinate={selectedLocation}
                    title="موقع الشكوى"
                    description="الموقع المحدد للشكوى"
                  />
                )}
              </MapView>
              
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={getCurrentLocation}
              >
                <Icon name="location-arrow" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            // Fallback - coordinate input
            <View>
              <View style={styles.coordinateInputContainer}>
                <View style={styles.coordinateRow}>
                  <View style={styles.coordinateField}>
                    <Text style={styles.coordinateLabel}>خط العرض (Latitude)</Text>
                    <TextInput
                      style={styles.coordinateInput}
                      placeholder="30.0444"
                      value={selectedLocation?.latitude?.toString() || ''}
                      onChangeText={(text) => {
                        const lat = parseFloat(text);
                        if (!isNaN(lat)) {
                          const newLocation = { ...selectedLocation, latitude: lat };
                          setSelectedLocation(newLocation);
                          formik.setFieldValue("location", `${lat},${selectedLocation?.longitude || 31.2357}`);
                        }
                      }}
                      keyboardType="numeric"
                      textAlign={isRTL ? "right" : "left"}
                    />
                  </View>
                  <View style={styles.coordinateField}>
                    <Text style={styles.coordinateLabel}>خط الطول (Longitude)</Text>
                    <TextInput
                      style={styles.coordinateInput}
                      placeholder="31.2357"
                      value={selectedLocation?.longitude?.toString() || ''}
                      onChangeText={(text) => {
                        const lng = parseFloat(text);
                        if (!isNaN(lng)) {
                          const newLocation = { ...selectedLocation, longitude: lng };
                          setSelectedLocation(newLocation);
                          formik.setFieldValue("location", `${selectedLocation?.latitude || 30.0444},${lng}`);
                        }
                      }}
                      keyboardType="numeric"
                      textAlign={isRTL ? "right" : "left"}
                    />
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.webLocationButton}
                  onPress={getCurrentLocation}
                >
                  <Icon name="location-arrow" size={16} color="#fff" />
                  <Text style={styles.webLocationButtonText}>الحصول على الموقع الحالي</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.webMapNote}>
                💡 يمكنك الحصول على الإحداثيات من خرائط جوجل أو استخدام زر "الحصول على الموقع الحالي"
              </Text>
            </View>
          )}
          
          <View style={styles.locationInfo}>
            <Icon name="map-marker" size={16} color="#6B7280" style={styles.locationIcon} />
            {selectedLocation ? (
              <Text style={styles.locationText}>
                إحداثيات الموقع: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text style={styles.locationText}>
                {MapView ? 'اضغط على الخريطة لتحديد موقع الشكوى' : 'أدخل إحداثيات الموقع أو استخدم زر الموقع الحالي'}
              </Text>
            )}
          </View>
          
          {formik.touched.location && formik.errors.location && (
            <Text style={styles.error}>{formik.errors.location}</Text>
          )}
        </View>

        {/* زر الإرسال */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, formik.isSubmitting && styles.buttonDisabled]}
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {formik.isSubmitting ? "جاري الإرسال..." : "إرسال الشكوى"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal عرض رقم الشكوى */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Icon name="check-circle" size={56} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>تم إرسال الشكوى بنجاح</Text>
            <Text style={styles.modalText}>
              سنقوم بمراجعة شكواك والرد عليها في أقرب وقت ممكن
            </Text>
            <Text style={styles.modalIdLabel}>رقم الشكوى: {newComplaintId}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>اغلاق</Text>
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
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
    minHeight: '100%',
  },
  card: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#183B4E",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: 'Tajawal',
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  row: {
    marginBottom: 16,
  },
  tabletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  field: { 
    marginBottom: 16,
  },
  halfField: {
    width: '48%',
  },
  label: { 
    color: "#374151", 
    marginBottom: 8, 
    fontWeight: "500",
    fontSize: 14,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#F5EEDC",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  textArea: { 
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: "#F5EEDC",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  error: { 
    color: "#EF4444", 
    marginTop: 4,
    fontSize: 12,
  },
  helper: { 
    color: "#6B7280", 
    marginTop: 4,
    fontSize: 12,
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 16,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: 'center',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  uploadSubtext: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
  },
  mediaPreviewContainer: {
    position: "relative",
    width: 160,
    height: 160,
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#374151",
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  submitSection: {
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: "#27548A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: { 
    opacity: 0.7,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DCFCE7",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: { 
    color: "#6B7280", 
    marginBottom: 16, 
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  modalIdLabel: {
    color: "#27548A",
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: "#27548A",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#D1D5DB",
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: "#27548A",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    color: "#6B7280",
    fontSize: 14,
    flex: 1,
  },
  coordinateInputContainer: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  coordinateField: {
    flex: 1,
  },
  coordinateLabel: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  coordinateInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  webLocationButton: {
    backgroundColor: "#27548A",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  webLocationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  webMapNote: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
