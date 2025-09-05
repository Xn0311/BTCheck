import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

const ChangePasswordScreen = () => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [userDocId, setUserDocId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const str = await AsyncStorage.getItem("currentUser");
      const curr = JSON.parse(str || "{}");

      const q = query(collection(db, "users"), where("userId", "==", curr.userId));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const d = snap.docs[0];
        const data = d.data();

        setSavedPassword(data.password ?? '');
        setUserDocId(d.id);
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    if (!userDocId || !newPassword || !currentPasswordInput || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (currentPasswordInput !== savedPassword) {
      Alert.alert("Sai mật khẩu", "Mật khẩu hiện tại không đúng.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Mật khẩu yếu", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const userRef = doc(db, 'users', userDocId);
      await updateDoc(userRef, {
        password: newPassword,
      });

      Alert.alert('Thành công', 'Đã đổi mật khẩu!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPasswordInput('');
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mật khẩu hiện tại:</Text>
      <TextInput
        value={currentPasswordInput}
        onChangeText={setCurrentPasswordInput}
        placeholder="Nhập mật khẩu hiện tại"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>Mật khẩu mới:</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nhập mật khẩu mới"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', fontSize: 16, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginTop: 8,
  },
  button: {
    backgroundColor: '#2e86de', paddingVertical: 12, borderRadius: 8,
    marginTop: 24, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
