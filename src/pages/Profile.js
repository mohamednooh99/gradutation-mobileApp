import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';
import { 
  updatePassword, 
  deleteUser, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';

const Profile = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('خطأ', 'كلمات المرور الجديدة غير متطابقة');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, newPassword);
      
      Alert.alert('نجح', 'تم تحديث كلمة المرور بنجاح');
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      let errorMessage = 'حدث خطأ أثناء تحديث كلمة المرور';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور الحالية غير صحيحة';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جداً';
      }
      
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentPassword) {
      Alert.alert('خطأ', 'يرجى إدخال كلمة المرور الحالية للتأكيد');
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user before deleting account
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      
      // Delete user account
      await deleteUser(currentUser);
      
      Alert.alert('تم الحذف', 'تم حذف الحساب بنجاح');
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      let errorMessage = 'حدث خطأ أثناء حذف الحساب';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'يرجى تسجيل الدخول مرة أخرى ثم المحاولة';
      }
      
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'تأكيد حذف الحساب',
      'هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => setDeleteModalVisible(true),
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="user-circle" size={80} color="#27548A" />
        </View>
        <Text style={styles.userName}>{currentUser?.displayName || 'المستخدم'}</Text>
        <Text style={styles.userEmail}>{currentUser?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إعدادات الحساب</Text>
        
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => setPasswordModalVisible(true)}
        >
          <View style={styles.optionContent}>
            <Icon name="lock" size={20} color="#27548A" style={styles.optionIcon} />
            <Text style={styles.optionText}>تغيير كلمة المرور</Text>
          </View>
          <Icon name="chevron-left" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionItem, styles.dangerOption]}
          onPress={confirmDeleteAccount}
        >
          <View style={styles.optionContent}>
            <Icon name="trash" size={20} color="#DC2626" style={styles.optionIcon} />
            <Text style={[styles.optionText, styles.dangerText]}>حذف الحساب</Text>
          </View>
          <Icon name="chevron-left" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionItem, styles.logoutOption]}
          onPress={handleLogout}
          disabled={loading}
        >
          <View style={styles.optionContent}>
            {loading ? (
              <ActivityIndicator size="small" color="#F59E0B" style={styles.optionIcon} />
            ) : (
              <Icon name="sign-out" size={20} color="#F59E0B" style={styles.optionIcon} />
            )}
            <Text style={[styles.optionText, styles.logoutText]}>
              {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
            </Text>
          </View>
          <Icon name="chevron-left" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Update Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تغيير كلمة المرور</Text>
            
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور الحالية"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              textAlign="right"
            />
            
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور الجديدة"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              textAlign="right"
            />
            
            <TextInput
              style={styles.input}
              placeholder="تأكيد كلمة المرور الجديدة"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              textAlign="right"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleUpdatePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>تحديث</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تأكيد حذف الحساب</Text>
            <Text style={styles.warningText}>
              تحذير: سيتم حذف جميع بياناتك نهائياً ولا يمكن استرجاعها
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="أدخل كلمة المرور للتأكيد"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              textAlign="right"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setCurrentPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>حذف الحساب</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
    fontFamily: 'Tajawal',
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Tajawal',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    paddingHorizontal: 20,
    fontFamily: 'Tajawal',
  },
  optionItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  optionIcon: {
    marginLeft: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Tajawal',
  },
  dangerOption: {
    borderBottomColor: '#FEE2E2',
  },
  dangerText: {
    color: '#DC2626',
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#F59E0B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Tajawal',
  },
  warningText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Tajawal',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Tajawal',
  },
  modalButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal',
  },
  confirmButton: {
    backgroundColor: '#27548A',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal',
  },
});

export default Profile;
