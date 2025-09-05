import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { collection, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const firestore = db;

const EditCVScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { cvId } = route.params;

  const [cv, setCV] = useState({
    cvName: "",
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    objective: "",
    skills: "",
    education: "",
    experience: "",
    activity: "",
    certificate: "",
    award: "",
    hobby: "",
    more: "",
    referrer: "",
  });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        if (!cvId) {
          Alert.alert("Lỗi", "Không tìm thấy cvId");
          return;
        }

        const docRef = doc(firestore, "CV", cvId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const safeData: any = {};
          Object.keys(cv).forEach((key) => {
            safeData[key] =
              data[key] !== undefined && data[key] !== null
                ? String(data[key])
                : "";
          });
          setCV(safeData);
        } else {
          Alert.alert("Thông báo", "Không tìm thấy dữ liệu CV");
        }
      } catch (error) {
        console.error("Lỗi khi tải CV:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu CV");
      }
    };

    fetchCV();
  }, [cvId]);

  const sanitizeCV = (cv: any) => {
    const sanitizedCV: Record<string, string | null> = {};
    for (const key in cv) {
      const value = cv[key];
      sanitizedCV[key] =
        value !== undefined && value !== null ? String(value) : "";
    }
    return sanitizedCV;
  };

  const handleSave = async () => {
    try {
      const str = await AsyncStorage.getItem("currentUser");
      const curr = str ? JSON.parse(str) : {};

      if (!curr.userId) {
        Alert.alert("Lỗi", "Không tìm thấy userId");
        return;
      }

      const userId = String(curr.userId);
      const sanitizedData = sanitizeCV(cv);

      if (!sanitizedData.cvName) {
        Alert.alert("Lỗi", "Tên CV không được để trống!");
        return;
      }

      if (cvId) {
        // Cập nhật CV hiện tại
        const docRef = doc(firestore, "CV", cvId);
        await updateDoc(docRef, {
          ...sanitizedData,
          userId,
        });
        Alert.alert("Thành công", "CV đã được cập nhật!");
        navigation.navigate("PreviewCVScreen", { cvId });
      } else {
        await addDoc(collection(firestore, "CV"), {
          ...sanitizedData,
          userId,
        });
        Alert.alert("Thành công", "CV mới đã được tạo!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu CV:", error);
      Alert.alert("Lỗi", `Không thể lưu CV: ${error.message || String(error)}`);
    }
  };

  const handleChange = (key: keyof typeof cv, value: string) => {
    setCV({ ...cv, [key]: value });
  };

  const renderInput = (
    label: string,
    key: keyof typeof cv,
    multiline = false
  ) => (
    <View style={styles.section} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={cv[key]}
        onChangeText={(text) => handleChange(key, text)}
        style={[styles.input, multiline && styles.textArea]}
        multiline={multiline}
        placeholder={`Nhập ${label}`}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginTop: "10%" }} />

      {/* Cập nhật trực tiếp "Tên CV" */}
      <View style={styles.section}>
        <Text style={styles.label}>Tên CV</Text>
        <TextInput
          value={cv.cvName}
          onChangeText={(text) => handleChange("cvName", text)}
          style={styles.input}
          placeholder="Nhập tên CV"
        />
      </View>

      {renderInput("Họ và tên", "fullName")}
      {renderInput("Ngày sinh", "dob")}
      {renderInput("Số điện thoại", "phone")}
      {renderInput("Email", "email")}
      {renderInput("Địa chỉ", "address")}
      {renderInput("Mục tiêu nghề nghiệp", "objective", true)}
      {renderInput("Kỹ năng", "skills", true)}
      {renderInput("Học vấn", "education", true)}
      {renderInput("Kinh nghiệm làm việc", "experience", true)}
      {renderInput("Hoạt động", "activity", true)}
      {renderInput("Chứng chỉ", "certificate", true)}
      {renderInput("Giải thưởng", "award", true)}
      {renderInput("Sở thích", "hobby", true)}
      {renderInput("Thông tin thêm", "more", true)}
      {renderInput("Người giới thiệu", "referrer", true)}

      <View style={{ marginTop: 20 }}>
        <Button title="Lưu CV" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default EditCVScreen;
