import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const SignupScreen = ({ navigation }) => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const generateUniqueUserId = async () => {
    let userId;
    let isUnique = false;
    while (!isUnique) {
      userId = Math.floor(100000 + Math.random() * 900000);
      const existingUser = await getDoc(doc(db, "users_by_id", userId.toString()));
      if (!existingUser.exists()) isUnique = true;
    }
    return userId;
  };

  const handleSignup = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", normalizedEmail);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        Alert.alert("Lỗi", "Tài khoản đã tồn tại");
        return;
      }

      const userId = await generateUniqueUserId();
      await setDoc(userRef, {
        userId,
        email: normalizedEmail,
        password,
        role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Thành công", "Tài khoản đã được tạo");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo tài khoản");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgroud/backgroud 3.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Đăng ký</Text>

            <Text style={styles.subTitle}>
              Bạn muốn tạo tài khoản với vai trò gì?
            </Text>

            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "user" && styles.selectedRole,
                ]}
                onPress={() => setRole("user")}
              >
                <Text style={styles.roleText}>Ứng viên</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "admin" && styles.selectedRole,
                ]}
                onPress={() => setRole("admin")}
              >
                <Text style={styles.roleText}>Nhà tuyển dụng</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Đã có tài khoản? Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2c3e50",
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  roleOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007bff",
    marginHorizontal: 10,
    backgroundColor: "#fff",
  },
  selectedRole: {
    backgroundColor: "#007bff",
  },
  roleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 15,
    fontSize: 15,
  },
});

export default SignupScreen;
