import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const AddJobsScreen = ({ navigation, route }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const { userId, companyName, address } = route.params;
  const [company, setCompany] = useState(companyName || "");
  const [companyAddress, setCompanyAddress] = useState(address || "");

  // Thêm quyền lợi, yêu cầu, cập nhật, xóa...
  const addBenefit = () => setBenefits([...benefits, ""]);
  const addRequirement = () => setRequirements([...requirements, ""]);

  const updateBenefit = (text: string, index: number) => {
    const newBenefits = [...benefits];
    newBenefits[index] = text;
    setBenefits(newBenefits);
  };
  const updateRequirement = (text: string, index: number) => {
    const newRequirements = [...requirements];
    newRequirements[index] = text;
    setRequirements(newRequirements);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
  };
  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };

  // Chọn ảnh từ thư viện
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      setImageUri(pickedImage.uri);
    }
  };

  const handleSaveJob = async () => {
    if (!title.trim() || !description.trim() || !company.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tiêu đề, mô tả và công ty");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        title,
        description,
        company,
        companyId: userId,
        companyAddress,
        location,
        salary,
        experience,
        industry,
        specialization,
        workplace,
        benefits: benefits.filter((b) => b.trim() !== ""),
        requirements: requirements.filter((r) => r.trim() !== ""),
        logo: imageUri, // Lưu URI ảnh (local URI)
        createdAt: serverTimestamp(),
        status: "active",
      });
      Alert.alert("Thành công", "Tin tuyển dụng đã được đăng");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng tin tuyển dụng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Đăng Tin Tuyển Dụng</Text>

      {renderInput("Tiêu đề công việc", title, setTitle, "Tiêu đề công việc")}
      {renderInput(
        "Mô tả công việc",
        description,
        setDescription,
        "Mô tả chi tiết công việc",
        true
      )}
      {renderInput(
        "Tên công ty",
        company,
        setCompany,
        "Tên công ty của bạn",
        false,
        true
      )}
      {renderInput(
        "Địa chỉ công ty",
        companyAddress,
        setCompanyAddress,
        "Địa chỉ công ty",
        false,
        true
      )}
      {renderInput("Địa điểm làm việc", location, setLocation, "Hà Nội")}
      {renderInput(
        "Mức lương",
        salary,
        setSalary,
        "Mức lương công việc? VD: 5 triệu hoặc thỏa thuận"
      )}
      {renderInput(
        "Kinh nghiệm",
        experience,
        setExperience,
        "Yêu cầu kinh nghiệm"
      )}
      {renderInput("Ngành nghề", industry, setIndustry, "Ngành nghề công việc")}
      {renderInput(
        "Chuyên ngành / Vị trí",
        specialization,
        setSpecialization,
        "Chuyên ngành hoặc vị trí công việc"
      )}
      {renderInput(
        "Địa chỉ nơi làm việc",
        workplace,
        setWorkplace,
        "Nếu khác với công ty"
      )}

      <Text style={styles.subHeading}>Quyền lợi</Text>
      {renderDynamicFields(
        benefits,
        updateBenefit,
        removeBenefit,
        "+ Thêm quyền lợi",
        addBenefit
      )}

      <Text style={styles.subHeading}>Yêu cầu</Text>
      {renderDynamicFields(
        requirements,
        updateRequirement,
        removeRequirement,
        "+ Thêm yêu cầu",
        addRequirement
      )}

      <Text style={styles.subHeading}>Ảnh công việc (không bắt buộc)</Text>
      <TouchableOpacity
        style={styles.imagePickerButton}
        onPress={handlePickImage}
      >
        <Text style={{ color: "#2e86de", fontWeight: "bold" }}>
          {imageUri ? "Chọn lại ảnh" : "Chọn ảnh từ thư viện"}
        </Text>
      </TouchableOpacity>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#ccc" }]}
        onPress={handleSaveJob}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang lưu..." : "Đăng công việc"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderInput = (
  label: string,
  value: string,
  setter: any,
  placeholder: string,
  multiline = false,
  disabled = false
) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        multiline && { height: 100 },
        disabled && { backgroundColor: "#eee" },
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={setter}
      multiline={multiline}
      editable={!disabled}
    />
  </View>
);

const renderDynamicFields = (
  data: string[],
  updater: any,
  remover: any,
  buttonText: string,
  adder: any
) => (
  <View>
    {data.map((item, index) => (
      <View key={index} style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={`${buttonText.replace("+ Thêm ", "")} #${index + 1}`}
          value={item}
          onChangeText={(text) => updater(text, index)}
        />
        <TouchableOpacity
          onPress={() => remover(index)}
          style={styles.removeButton}
        >
          <Text style={{ color: "red", fontWeight: "bold" }}>X</Text>
        </TouchableOpacity>
      </View>
    ))}
    <TouchableOpacity onPress={adder} style={styles.addButton}>
      <Text style={{ color: "#2e86de", fontWeight: "bold" }}>{buttonText}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fdfdfd",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2e86de",
    textAlign: "center",
    marginTop: 20,
  },
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2e86de",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
  },
  addButton: {
    marginTop: 4,
    marginBottom: 10,
  },
  subHeading: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  imagePickerButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#2e86de",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default AddJobsScreen;
