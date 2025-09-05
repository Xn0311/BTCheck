import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useRoute, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AppliedJobsScreen = ({ navigation }: any) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Username, Setusername] = useState("");
  const [avata, setAvatar] = useState("");

  type JobDetailRouteProp = RouteProp<{ params: { userId: string } }, "params">;
  const route = useRoute<JobDetailRouteProp>();
  const { userId } = route.params;

  const fetchApplications = async () => {
    try {
      if (!userId) {
        console.warn("Không tìm thấy userId");
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "applications"),
        where("userId", "==", Number(userId))
      );
      const querySnapshot = await getDocs(q);
      ////////////
      const dataWithDetails = await Promise.all(
        querySnapshot.docs.map(async (applicationDoc) => {
          const appData = applicationDoc.data();

          // Tạo reference đến job và company
          const jobRef = doc(db, "jobs", String(appData.jobId));
          const companyRef = doc(db, "companies", String(appData.companyId));

          const [jobSnap, companySnap] = await Promise.all([
            getDoc(jobRef),
            getDoc(companyRef),
          ]);

          const jobData = jobSnap.exists() ? jobSnap.data() : null;
          const companyData = companySnap.exists() ? companySnap.data() : null;

          // 👉 Log tên công ty và ID công ty
          if (companyData) {
            console.log("✅ Công ty ứng tuyển:", {
              companyId: appData.companyId,
              companyName: companyData.name,
            });
          }

          return {
            id: applicationDoc.id,
            jobTitle: jobData?.title || appData.jobTitle || "Không rõ",
            company: companyData?.name || appData.company || "Không rõ",
            companyAddress:
              companyData?.address || appData.companyAddress || "Không rõ",
            applyTime: appData.applyTime,
            status: appData.status,
            contactEmail: companyData?.email || "",
            contactPhone: companyData?.phone || "",
            companyId: appData.companyId,
            companyName: companyData?.name || appData.company || "Không rõ",
          };
        })
      );

      ////////
      const sorted = dataWithDetails.sort((a, b) => {
        const aTime = a.applyTime?.seconds || 0;
        const bTime = b.applyTime?.seconds || 0;
        return bTime - aTime;
      });

      setApplications(sorted);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ứng tuyển:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    logUserInfo(userId);
  }, []);

  const handleWithdraw = (id: string) => {
    Alert.alert(
      "Xác nhận thu hồi",
      "Bạn có chắc chắn muốn thu hồi đơn ứng tuyển này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Thu hồi",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "applications", id));
              setApplications((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              console.error("Lỗi khi thu hồi ứng tuyển:", error);
              Alert.alert("Lỗi", "Không thể thu hồi đơn ứng tuyển.");
            }
          },
        },
      ]
    );
  };

  const startChatWithApplicant = async (item) => {
    try {
      const currentUserIdStr = String(item.companyId); // ID công ty hiện tại
      const applicantIdStr = String(userId); // ID ứng viên từ item

      const sortedIds = [currentUserIdStr, applicantIdStr].sort();
      const chatKey = `${sortedIds[0]}_${sortedIds[1]}`;

      const chatsRef = collection(db, "chats");

      const q = query(chatsRef, where("chatKey", "==", chatKey));
      const querySnapshot = await getDocs(q);

      let chatId;

      if (!querySnapshot.empty) {
        // Đã có cuộc trò chuyện
        chatId = querySnapshot.docs[0].id;
      } else {
        // 2. Nếu chưa có thì tạo mới từ item
        const applicantData = item;

        const newChatDoc = await addDoc(chatsRef, {
          companyname: item.companyName || "Công ty",
          avatacompany: item.company || "https://i.pravatar.cc/150?img=10",
          Username: Username || "Người dùng",
          avataruser: avata || "https://i.pravatar.cc/150?img=10",
          participants: [currentUserIdStr, applicantIdStr],
          chatKey: chatKey,
          lastMessage: "",
          time: serverTimestamp(),
          unreadCountByUser: {
            [currentUserIdStr]: 0,
            [applicantIdStr]: 0,
          },
        });
        chatId = newChatDoc.id;
      }
      // 3. Điều hướng đến màn hình chat
      navigation.navigate("ChatScreen", {
        chatId,
        name: Username || "Người dùng",
        userId: currentUserIdStr,
        companyName: item.companyName || "Công ty",
        companyid: applicantIdStr,
      });
    } catch (error) {
      console.error("Lỗi khi bắt đầu chat:", error);
      Alert.alert("Lỗi", "Không thể khởi tạo cuộc trò chuyện.");
    }
  };

  const handleMess = (item: any) => {
    console.log("tên công ty:", item.companyName);
    console.log("id công ty:", item.companyId);
    console.log("userid", userId);
    startChatWithApplicant(item);
  };

  const logUserInfo = async (userId) => {
    try {
      const q = query(
        collection(db, "users"),
        where("userId", "==", Number(userId))
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`⚠️ Không tìm thấy user có userId: ${userId}`);
        return;
      }

      const docSnap = snapshot.docs[0]; // lấy bản ghi đầu tiên
      const userData = docSnap.data();

      Setusername(userData.fullName);
      setAvatar(userData.avatarUrl);
    } catch (error) {
      console.error("❌ Lỗi khi truy vấn người dùng:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "đã duyệt":
        return "#28a745";
      case "đã từ chối":
        return "#dc3545";
      default:
        return "#ffc107";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="work-outline" size={24} color="#007bff" />
        <Text style={styles.title}>{item.jobTitle}</Text>
      </View>
      <Text style={styles.company}>🏢 {item.company}</Text>
      <Text style={styles.address}>📍 {item.companyAddress}</Text>
      <Text style={styles.time}>
        🕒 {item.applyTime?.toDate().toLocaleString()}
      </Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        📌{" "}
        {item.status === "applied"
          ? "Đã ứng tuyển"
          : item.status || "Chưa rõ trạng thái"}
      </Text>

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => handleMess(item)}
      >
        <Text style={styles.contactButtonText}>Liên hệ với nhà tuyển dụng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.withdrawButton}
        onPress={() => handleWithdraw(item.id)}
      >
        <Text style={styles.withdrawButtonText}>Thu hồi ứng tuyển</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (applications.length === 0) {
    return (
      <View style={styles.center}>
        <Icon name="info-outline" size={40} color="#888" />
        <Text style={{ marginTop: 12, color: "#555" }}>
          Bạn chưa ứng tuyển công việc nào.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={applications}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default AppliedJobsScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
  },
  company: {
    fontSize: 15,
    color: "#444",
    marginTop: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  time: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contactButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#17a2b8",
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  withdrawButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#dc3545",
    alignItems: "center",
  },
  withdrawButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
