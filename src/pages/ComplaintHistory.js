import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const ComplaintHistory = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, [currentUser]);

  const loadComplaints = async () => {
    if (!currentUser) {
      console.log('No current user found');
      return;
    }

    try {
      setLoading(true);
      console.log('Loading complaints for user:', currentUser.uid);
      
      const complaintsRef = collection(db, 'complaints');
      
      // Try multiple query strategies
      let q;
      
      // First try with userId
      q = query(
        complaintsRef,
        where('userId', '==', currentUser.uid)
      );
      
      let querySnapshot = await getDocs(q);
      
      // If no results and user has email, try querying by email as fallback
      if (querySnapshot.empty && currentUser.email) {
        console.log('No complaints found by userId, trying email:', currentUser.email);
        q = query(
          complaintsRef,
          where('email', '==', currentUser.email)
        );
        querySnapshot = await getDocs(q);
      }
      
      const complaintsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Found complaint:', doc.id, data);
        complaintsData.push({
          id: doc.id,
          ...data,
        });
      });
      
      // Sort manually by createdAt if available
      complaintsData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const aTime = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bTime = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return bTime - aTime;
      });
      
      console.log('Total complaints loaded:', complaintsData.length);
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error loading complaints:', error);
      console.error('Error details:', error.code, error.message);
      
      // Try alternative query without userId filter to check if any complaints exist
      try {
        console.log('Trying to load all complaints to debug...');
        const allComplaintsQuery = query(collection(db, 'complaints'));
        const allSnapshot = await getDocs(allComplaintsQuery);
        console.log('Total complaints in database:', allSnapshot.size);
        
        allSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Complaint userId:', data.userId, 'Current user:', currentUser.uid);
        });
      } catch (debugError) {
        console.error('Debug query failed:', debugError);
      }
      
      Alert.alert('خطأ', `فشل في تحميل سجل الشكاوي: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadComplaints();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المعالجة':
        return '#F59E0B';
      case 'تم الحل':
        return '#10B981';
      case 'مرفوض':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'غير محدد';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const renderComplaintItem = ({ item }) => (
    <View style={styles.complaintCard}>
      <View style={styles.cardHeader}>
        <View style={styles.complaintIdContainer}>
          <Text style={styles.complaintId}>#{item.complaintId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <View style={styles.cardContent}>
        {item.administration && (
          <View style={styles.infoRow}>
            <Icon name="building-o" size={16} color="#27548A" style={styles.infoIcon} />
            <Text style={styles.administrationText}>{item.administration}</Text>
          </View>
        )}
        
        {item.governorate && (
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={16} color="#27548A" style={styles.infoIcon} />
            <Text style={styles.governorateText}>{item.governorate}</Text>
          </View>
        )}
        
        {item.description && (
          <View style={styles.descriptionContainer}>
            <Icon name="file-text-o" size={16} color="#6B7280" style={styles.infoIcon} />
            <Text style={styles.descriptionPreview} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.attachmentsContainer}>
          {item.imagesBase64 && item.imagesBase64.length > 0 && (
            <View style={styles.attachmentIndicator}>
              <Icon name="image" size={14} color="#10B981" />
              <Text style={styles.attachmentText}>صورة مرفقة</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => openComplaintDetails(item)}
        >
          <Text style={styles.detailsButtonText}>عرض التفاصيل</Text>
          <Icon name="arrow-left" size={14} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComplaintDetails = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>تفاصيل الشكوى</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="times" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {selectedComplaint && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>رقم الشكوى:</Text>
                <Text style={styles.detailValue}>#{selectedComplaint.complaintId}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>الحالة:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedComplaint.status) }]}>
                  <Text style={styles.statusText}>{selectedComplaint.status}</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>التاريخ:</Text>
                <Text style={styles.detailValue}>{formatDate(selectedComplaint.createdAt)}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>الإدارة المختصة:</Text>
                <Text style={styles.detailValue}>{selectedComplaint.administration}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>المحافظة:</Text>
                <Text style={styles.detailValue}>{selectedComplaint.governorate}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>الوصف:</Text>
                <Text style={styles.descriptionFull}>{selectedComplaint.description}</Text>
              </View>
              
              {selectedComplaint.imagesBase64 && selectedComplaint.imagesBase64.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>الصور المرفقة:</Text>
                  {selectedComplaint.imagesBase64.map((imageBase64, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageBase64 }}
                      style={styles.attachedImage}
                      resizeMode="contain"
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27548A" />
        <Text style={styles.loadingText}>جاري تحميل سجل الشكاوي...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-right" size={24} color="#27548A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>سجل الشكاوي</Text>
        <View style={styles.placeholder} />
      </View>
      
      {complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="file-text-o" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>لا توجد شكاوي</Text>
          <Text style={styles.emptySubtitle}>لم تقم بتقديم أي شكاوي بعد</Text>
          <TouchableOpacity
            style={styles.addComplaintButton}
            onPress={() => navigation.navigate('ComplaintForm')}
          >
            <Text style={styles.addComplaintButtonText}>تقديم شكوى جديدة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#27548A']}
              tintColor="#27548A"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {renderComplaintDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27548A',
    fontFamily: 'Tajawal',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Tajawal',
  },
  listContainer: {
    padding: 16,
  },
  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27548A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  complaintIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complaintId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27548A',
    marginLeft: 12,
    fontFamily: 'Tajawal',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Tajawal',
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Tajawal',
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginLeft: 8,
    width: 20,
  },
  administrationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    fontFamily: 'Tajawal',
  },
  governorateText: {
    fontSize: 15,
    color: '#4B5563',
    flex: 1,
    fontFamily: 'Tajawal',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  descriptionPreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    flex: 1,
    fontFamily: 'Tajawal',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  attachmentsContainer: {
    flex: 1,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  attachmentText: {
    fontSize: 12,
    color: '#10B981',
    marginRight: 4,
    fontWeight: '500',
    fontFamily: 'Tajawal',
  },
  detailsButton: {
    backgroundColor: '#27548A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#27548A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    fontFamily: 'Tajawal',
  },
  buttonIcon: {
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Tajawal',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Tajawal',
  },
  addComplaintButton: {
    backgroundColor: '#27548A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addComplaintButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tajawal',
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
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27548A',
    fontFamily: 'Tajawal',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Tajawal',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Tajawal',
  },
  descriptionFull: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontFamily: 'Tajawal',
  },
  attachedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ComplaintHistory;
