import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const ApplicationDetailScreen = ({ route, navigation }) => {
  const { userInfo, userId, currentUserId, companyName } = route.params;

  const handleCall = () => {
    if (userInfo.phone) {
      Linking.openURL(`tel:${userInfo.phone}`);
    } else {
      Alert.alert("Thông báo", "Ứng viên chưa cung cấp số điện thoại");
    }
  };
  const startChatWithApplicant = async () => {
    try {
      const currentUserIdStr = String(currentUserId);
      const applicantIdStr = String(userId);

      const chatsRef = collection(db, "chats");

      // 1. Kiểm tra xem đã có chat chưa
      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUserIdStr)
      );
      const querySnapshot = await getDocs(q);

      let existingChatId = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const participants = data.participants || [];

        if (
          participants.length === 2 &&
          participants.includes(currentUserIdStr) &&
          participants.includes(applicantIdStr)
        ) {
          existingChatId = doc.id;
        }
      });

      let chatId = existingChatId;

      // 2. Nếu chưa có chat thì tạo mới
      if (!chatId) {
        const currentUserDoc = await getDoc(doc(db, "users", currentUserIdStr));
        const applicantDoc = await getDoc(doc(db, "users", applicantIdStr));

        const currentUserData = currentUserDoc.exists()
          ? currentUserDoc.data()
          : {};
        const applicantData = applicantDoc.exists() ? applicantDoc.data() : {};

        const isRecruiter = currentUserData.role === "recruiter";

        const newChatDoc = await addDoc(chatsRef, {
          companyname: companyName || "Công ty",
          avatacompany: "https://i.pravatar.cc/150?img=10",
          Username: userInfo.fullName || "Người dùng",
          avataruser: userInfo.avatarUrl || "https://i.pravatar.cc/150?img=10",
          participants: [currentUserIdStr, applicantIdStr],
          lastMessage: "",
          time: serverTimestamp(),
          unreadCountByUser: {
            [currentUserIdStr]: 0,
            [applicantIdStr]: 0,
          },
        });
        chatId = newChatDoc.id;
      }
      const opponentId =
        currentUserIdStr === applicantIdStr ? null : applicantIdStr;

      const opponentDoc = await getDoc(doc(db, "users", opponentId));
      const opponentData = opponentDoc.exists() ? opponentDoc.data() : {};

      navigation.navigate("ChatScreen", {
        chatId,
        name: userInfo.fullName || "Người dùng",
        userId: currentUserIdStr,
        companyName: companyName || "Công ty",
        companyid: applicantIdStr,
      });
    } catch (error) {
      console.error("Lỗi khi bắt đầu chat:", error);
    }
  };
  const updateApplicationStatus = async (newStatus) => {
    try {
      const q = query(
        collection(db, "applications"),
        where("userId", "==", userId),
        where("companyId", "==", currentUserId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Thông báo", "Không tìm thấy đơn ứng tuyển.");
        return;
      }

      for (const docSnap of querySnapshot.docs) {
        const appRef = doc(db, "applications", docSnap.id);
        await updateDoc(appRef, { status: newStatus }); // ✅ Sử dụng updateDoc
      }

      Alert.alert("Thành công", "Cập nhật trạng thái thành công.");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
    }
  };

  const handleMess = () => {
    if (!userInfo.email) {
      Alert.alert("Thông báo", "Ứng viên chưa cung cấp email");
      return;
    }
    startChatWithApplicant();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.card}>
        {userInfo.avatarUrl ? (
          <Image
            source={{ uri: userInfo.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={64} color="#aaa" />
          </View>
        )}

        <Text style={styles.title}>{userInfo.fullName || "Không có tên"}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.infoText}>
            {userInfo.email || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.infoText}>
            {userInfo.phone || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Công việc mong muốn</Text>
          <Text style={styles.infoText}>
            {userInfo.desiredJobs && userInfo.desiredJobs.length > 0
              ? userInfo.desiredJobs.join(", ")
              : "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Vị trí mong muốn</Text>
          <Text style={styles.infoText}>
            {userInfo.desiredLocations && userInfo.desiredLocations.length > 0
              ? userInfo.desiredLocations.join(", ")
              : "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Kinh nghiệm làm việc</Text>
          <Text style={styles.infoText}>
            {userInfo.workExperience && userInfo.workExperience.length > 0
              ? userInfo.workExperience.join(", ")
              : "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.callButton]}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Ionicons
              name="call"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Gọi điện</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={handleMess}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Gửi tin nhắn</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statusButtonContainer}>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: "#22c55e" }]}
            onPress={() => updateApplicationStatus("Chấp thuận")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.statusButtonText}>Chấp thuận</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: "#ef4444" }]}
            onPress={() => updateApplicationStatus("Từ chối")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.statusButtonText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ApplicationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#2e86de",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  infoSection: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  callButton: {
    backgroundColor: "#16a34a",
    marginRight: 12,
  },
  emailButton: {
    backgroundColor: "#2563eb",
    marginLeft: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  statusButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    width: "100%",
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
