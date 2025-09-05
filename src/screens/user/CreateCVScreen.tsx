import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

const firestore = db;

const CreateCVScreen = ({ navigation }: any) => {
  const [cv, setCV] = useState({
    cvName: '',
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    objective: '',
    skills: '',
    education: '',
    experience: '',
    activity: '',
    certificate: '',
    award: '',
    hobby: '',
    more: '',
    referrer: '',
  });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const str = await AsyncStorage.getItem('currentUser');
        const curr = str ? JSON.parse(str) : {};

        if (!curr.userId) {
          Alert.alert('Lỗi', 'Không tìm thấy userId');
          return;
        }

        const userId = curr.userId;

        const q = query(collection(firestore, 'CV'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          const safeData: any = {};
          Object.keys(cv).forEach(key => {
            safeData[key] = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
          });
          setCV(safeData);
        }
      } catch (error) {
        console.error('Lỗi khi tải CV:', error);
      }
    };

    fetchCV();
  }, []);

  const sanitizeCV = (cv: any) => {
    const sanitizedCV: Record<string, string | null> = {};
    for (const key in cv) {
      const value = cv[key];
      sanitizedCV[key] = value !== undefined && value !== null ? String(value) : '';
    }
    return sanitizedCV;
  };

  const handleSave = async () => {
    try {
      const str = await AsyncStorage.getItem('currentUser');
      const curr = str ? JSON.parse(str) : {};

      if (!curr.userId) {
        Alert.alert('Lỗi', 'Không tìm thấy userId');
        return;
      }

      const userId = String(curr.userId);
      const sanitizedData = sanitizeCV(cv);

      if (!sanitizedData.cvName) {
        Alert.alert('Lỗi', 'Tên CV không được để trống!');
        return;
      }

      const q = query(
        collection(firestore, 'CV'),
        where('userId', '==', userId),
        where('cvName', '==', sanitizedData.cvName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...sanitizedData,
          userId,
        });
        Alert.alert('Thành công', 'CV đã được cập nhật!');
      } else {
        await addDoc(collection(firestore, 'CV'), {
          ...sanitizedData,
          userId,
        });
        Alert.alert('Thành công', 'CV mới đã được tạo!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu CV:', error);
      Alert.alert('Lỗi', `Không thể lưu CV: ${error.message || String(error)}`);
    }
  };

  const handleChange = (key: keyof typeof cv, value: string) => {
    setCV({ ...cv, [key]: value });
  };

  const renderInput = (label: string, key: keyof typeof cv, multiline = false) => (
    <View style={styles.inputGroup} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={cv[key]}
        onChangeText={(text) => handleChange(key, text)}
        style={[styles.input, multiline && styles.textArea]}
        multiline={multiline}
        placeholder={`Nhập ${label.toLowerCase()}...`}
        placeholderTextColor="#888"
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tạo / Chỉnh sửa CV</Text>
      <View style={styles.form}>
        {renderInput('Tên CV', 'cvName')}
        {renderInput('Họ và tên', 'fullName')}
        {renderInput('Ngày sinh', 'dob')}
        {renderInput('Số điện thoại', 'phone')}
        {renderInput('Email', 'email')}
        {renderInput('Địa chỉ', 'address')}
        {renderInput('Mục tiêu nghề nghiệp', 'objective', true)}
        {renderInput('Kỹ năng', 'skills', true)}
        {renderInput('Học vấn', 'education', true)}
        {renderInput('Kinh nghiệm làm việc', 'experience', true)}
        {renderInput('Hoạt động', 'activity', true)}
        {renderInput('Chứng chỉ', 'certificate', true)}
        {renderInput('Giải thưởng', 'award', true)}
        {renderInput('Sở thích', 'hobby', true)}
        {renderInput('Thông tin thêm', 'more', true)}
        {renderInput('Người giới thiệu', 'referrer', true)}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Lưu CV</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 15,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateCVScreen;
