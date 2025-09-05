import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", normalizedEmail);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        Alert.alert("Lỗi", "Tài khoản không tồn tại");
        return;
      }

      const userData = docSnap.data();
      if (userData.password !== password) {
        Alert.alert("Lỗi", "Mật khẩu không đúng");
        return;
      }

      await AsyncStorage.setItem("currentUser", JSON.stringify(userData));
      await AsyncStorage.setItem("currentUserId", normalizedEmail);

      if (userData.role === "admin") {
        navigation.replace("AdminScreen");
      } else {
        navigation.replace("MainTabs");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f0f4f8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/backgroud/backgroud 3.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={require("../../assets/icons/miniLogo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Chào mừng trở lại với chúng tôi!</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius:20,
    marginTop: - 70,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
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

export default LoginScreen;
