import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function EditProfileScreen() {
  const [selectedField, setSelectedField] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleSave = () => {
    if (!selectedField) {
      Alert.alert("Thông báo", "Vui lòng chọn thông tin cần sửa.");
      return;
    }

    // Xử lý lưu dữ liệu ở đây (gọi API, cập nhật state cha, v.v.)
    Alert.alert("Đã lưu", `Đã cập nhật ${selectedField} thành: ${fieldValue}`);
    console.log(`Cập nhật ${selectedField}:`, fieldValue);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Chọn thông tin cần thay đổi:</Text>

      <View style={{ borderWidth: 1, borderRadius: 8, marginBottom: 20 }}>
        <Picker
          selectedValue={selectedField}
          onValueChange={(itemValue) => {
            setSelectedField(itemValue);
            setFieldValue(""); // reset input khi đổi mục
          }}
        >
          <Picker.Item label="-- Chọn mục --" value="" />
          <Picker.Item label="Họ tên" value="name" />
          <Picker.Item label="Số điện thoại" value="phone" />
          <Picker.Item label="Địa chỉ" value="address" />
        </Picker>
      </View>

      {selectedField !== "" && (
        <>
          <Text>Nhập {selectedField === "name" ? "họ tên" : selectedField === "phone" ? "số điện thoại" : "địa chỉ"}:</Text>
          <TextInput
            value={fieldValue}
            onChangeText={setFieldValue}
            placeholder={`Nhập ${selectedField}`}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
            }}
          />
          <TouchableOpacity
            onPress={handleSave}
            style={{ backgroundColor: "#007bff", padding: 14, borderRadius: 8 }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Lưu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
