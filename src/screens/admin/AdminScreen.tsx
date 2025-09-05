import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const AdminScreen = ({ navigation }: any) => {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [userId, setUserId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingPostedJobs, setLoadingPostedJobs] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [viewMode, setViewMode] = useState("applied");
  const [postedJobs, setPostedJobs] = useState([]);

  const companyDocId = "companyInfo";

  useEffect(() => {
   

    const loadCompanyInfo = async () => {
      setLoadingCompany(true);
      try {
        const docRef = doc(db, "companies", companyDocId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyName(data.name || "");
          setAddress(data.address || "");
          setDescription(data.description || "");
          setAvatarUrl(data.avatarUrl || "");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không tải được thông tin công ty");
      } finally {
        setLoadingCompany(false);
      }
    };

    const getUserIdByEmail = async (email: string) => {
      try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            setUserId(data.userId.toString());
          });
        }
      } catch (error) {
        console.error("Lỗi khi tìm userId theo email:", error);
      }
    };

    const getUserId = async () => {
      try {
        const email = await AsyncStorage.getItem("currentUserId");
        if (email) {
          await getUserIdByEmail(email);
        }
      } catch (error) {
        console.error("Lỗi lấy email từ AsyncStorage:", error);
      }
    };

    loadCompanyInfo();
    getUserId();

    const jobsQuery = query(
      collection(db, "jobs"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeJobs = onSnapshot(jobsQuery, (querySnapshot) => {
      const jobsData: any[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobsData);

      const filteredPostedJobs = jobsData.filter(
        (job) => job.companyId?.toString() === userId?.toString()
      );
      setPostedJobs(filteredPostedJobs);
    });

    // const applicationsQuery = query(collection(db, "applications"));
    // const unsubscribeApplications = onSnapshot(
    //   applicationsQuery,
    //   async (querySnapshot) => {
    //     const appPromises = querySnapshot.docs.map(async (docSnap) => {
    //       const data = docSnap.data();
    //       const userId1 = data.userId;
    //       const jobId = data.jobId;
    //       let userInfo = {};
    //       let jobInfo = {};

    //       try {
    //         const qUser = query(
    //           collection(db, "users"),
    //           where("userId", "==", userId1)
    //         );
    //         const userSnapshot = await getDocs(qUser);
    //         if (!userSnapshot.empty) {
    //           userInfo = userSnapshot.docs[0].data();
    //         }
    //       } catch (error) {
    //         console.warn("Không lấy được thông tin người dùng:", error);
    //       }

    //       try {
    //         const jobDoc = await getDoc(doc(db, "jobs", jobId));
    //         if (jobDoc.exists()) {
    //           jobInfo = jobDoc.data();
    //         }
    //       } catch (error) {
    //         console.warn("Không lấy được thông tin công việc:", error);
    //       }

    //       return {
    //         id: docSnap.id,
    //         ...data,
    //         userInfo,
    //         jobInfo,
    //       };
    //     });

    //     const appsWithJobAndUser = await Promise.all(appPromises);

    //     // ✅ Lọc ứng tuyển cho công ty hiện tại
    //     // const filteredApps = appsWithJobAndUser.filter((app) => {
    //     //   const jobCompanyId = (app.jobInfo as { companyId?: number })
    //     //     .companyId;
    //     //   return jobCompanyId?.toString() === userId?.toString();
    //     // });
    //     const filteredApps = appsWithJobAndUser.filter((app) => {
    //       const jobCompanyId = app.jobInfo?.companyId?.toString();
    //       return jobCompanyId === userId?.toString();
    //     });

    //     setApplications(filteredApps);
    //     setLoadingApplications(false);
    //   }
    // );
    const unsubscribeApplications = onSnapshot(
      collection(db, "applications"),
      async (querySnapshot) => {
        const appPromises = querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          // Lấy jobInfo
          let jobInfo = {};
          try {
            const jobDoc = await getDoc(doc(db, "jobs", data.jobId));
            if (jobDoc.exists()) {
              jobInfo = jobDoc.data();
            } else {
              console.warn("❌ Không tìm thấy job với jobId:", data.jobId);
            }
          } catch (error) {
            console.warn("🚨 Lỗi khi lấy jobInfo:", error);
          }
          // Lấy userInfo
          let userInfo = {};
          try {
            const qUser = query(
              collection(db, "users"),
              where("userId", "==", data.userId)
            );
            const userSnapshot = await getDocs(qUser);
            if (!userSnapshot.empty) {
              userInfo = userSnapshot.docs[0].data();
            }
          } catch (error) {
            console.warn("Lỗi lấy userInfo:", error);
          }

          return {
            id: docSnap.id,
            ...data,
            jobInfo,
            userInfo,
          };
        });

        const appsWithJobAndUser = await Promise.all(appPromises);

        // Lọc ứng tuyển thuộc công ty hiện tại
        const companyId = userId?.toString();
        const filteredApps = appsWithJobAndUser.filter(
          (app) => app.jobInfo.companyId === companyId
        );
        //console.log("🟢 userid:", userId);
        //console.log("🟢 Danh sách ứng tuyển:", appsWithJobAndUser);
        // console.log(
        //   "🟢 Danh sách ứng tuyển sau khi lọc theo companyId:",
        //   filteredApps
        // );

        setApplications(filteredApps);
        setLoadingApplications(false);
      }
    );

    return () => {
      unsubscribeJobs();
      unsubscribeApplications();
    };
  }, [userId]);

  const handleSaveCompany = async () => {
    if (!companyName.trim()) {
      Alert.alert("Lỗi", "Tên công ty không được để trống");
      return;
    }
    setLoadingCompany(true);
    try {
      await setDoc(doc(db, "companies", companyDocId), {
        name: companyName,
        address,
        description,
        avatarUrl,
      });
      Alert.alert("Thành công", "Thông tin công ty đã được cập nhật");
      setIsEditingCompany(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin công ty");
    } finally {
      setLoadingCompany(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      uploadImageToStorage(image.uri);
    }
  };

  const uploadImageToStorage = async (uri: string) => {
    try {
      const storage = getStorage();
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `avatars/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setAvatarUrl(downloadURL);
      await setDoc(doc(db, "companies", companyDocId), {
        name: companyName,
        address,
        description,
        avatarUrl: downloadURL,
      });
      Alert.alert("Thành công", "Cập nhật avatar thành công");
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      Alert.alert("Lỗi", "Không thể upload ảnh");
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };

  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applicationItem}
      onPress={() =>
        navigation.navigate("ApplicationDetailScreen", {
          userInfo: item.userInfo,
          userId: item.userId,
          currentUserId: userId,
          companyName: companyName,
        })
      }
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        {item.userInfo.fullName || "Ứng viên chưa có tên"}
      </Text>
      <Text>Email: {item.userInfo.email || "Không có email"}</Text>
      <Text>SĐT: {item.userInfo.phone || "Không có số điện thoại"}</Text>
      <Text style={{ marginTop: 6 }}>
        Công việc: {item.jobInfo?.title || "Chưa rõ"}
      </Text>
      <Text>Trạng thái: {item.status || "Chưa cập nhật"}</Text>
    </TouchableOpacity>
  );

  const renderPostedJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applicationItem}
      onPress={() => {
        console.log;
        navigation.navigate("AJobDetailScreen", { jobId: item.id });
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        {item.title || "Chưa có tiêu đề"}
      </Text>
      <Text>Mức lương: {item.salary || "Không rõ"}</Text>
      <Text>Địa điểm: {item.location || "Không rõ"}</Text>
      <Text>
        Ngày đăng:{" "}
        {item.createdAt?.toDate?.().toLocaleDateString() || "Không rõ"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setShowAvatarOptions(!showAvatarOptions)}
        >
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../../assets/avata/avatar-trang.jpg")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        {showAvatarOptions && (
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Ionicons
              name="image"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Sửa ảnh đại diện</Text>
          </TouchableOpacity>
        )}

        {/* Thông tin công ty */}
        {isEditingCompany ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Tên công ty"
              value={companyName}
              onChangeText={setCompanyName}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 8 }]}
                onPress={handleSaveCompany}
                disabled={loadingCompany}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>
                  {loadingCompany ? "Đang lưu..." : "Lưu"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonSecondary, { flex: 1, marginLeft: 8 }]}
                onPress={() => setIsEditingCompany(false)}
              >
                <Text style={styles.buttonTextSecondary}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.infoText}>
              Tên công ty: {companyName || "Chưa có"}
            </Text>
            <Text style={styles.infoText}>Địa chỉ: {address || "Chưa có"}</Text>
            <Text style={styles.infoText}>ID : {userId || "Chưa có"}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditingCompany(true)}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Sửa thông tin</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              viewMode === "applied" && styles.activeSwitchButton,
            ]}
            onPress={() => setViewMode("applied")}
          >
            <Text
              style={[
                styles.switchText,
                viewMode === "applied" && styles.activeSwitchText,
              ]}
            >
              Ds Ứng tuyển
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              viewMode === "posted" && styles.activeSwitchButton,
            ]}
            onPress={() => setViewMode("posted")}
          >
            <Text
              style={[
                styles.switchText,
                viewMode === "posted" && styles.activeSwitchText,
              ]}
            >
              Ds Công việc
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === "applied" ? (
          <>
            <Text style={styles.sectionTitle}>Danh sách ứng tuyển</Text>
            {loadingApplications ? (
              <Text>Đang tải đơn ứng tuyển...</Text>
            ) : applications.length === 0 ? (
              <Text>Chưa có đơn ứng tuyển nào</Text>
            ) : (
              <FlatList
                data={applications}
                keyExtractor={(item) => item.id}
                renderItem={renderApplicationItem}
                scrollEnabled={false}
              />
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Danh sách công việc đã đăng</Text>
            {loadingPostedJobs ? (
              <Text>Đang tải công việc...</Text>
            ) : postedJobs.length === 0 ? (
              <Text>Chưa đăng công việc nào</Text>
            ) : (
              <FlatList
                data={postedJobs}
                keyExtractor={(item) => item.id}
                renderItem={renderPostedJobItem}
                scrollEnabled={false}
              />
            )}
          </>
        )}

        {/* Nút đăng xuất */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e53935" }]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB thêm việc */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("AddJobsScreen", {
            userId: userId,
            companyName: companyName,
            address: address,
          })
        }
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* FAB chat */}
      <TouchableOpacity
        style={styles.fab1}
        onPress={() =>
          navigation.navigate("ChatListScreen", { userId: userId })
        }
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#f9f9f9",
  },
  avatarWrapper: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#0066cc",
    backgroundColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF", // Màu xanh iOS
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 15,
    marginBottom: 12,
    color: "#444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 28,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
    color: "#222",
  },
  applicationItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  fab1: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#00cc66",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: "white",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 4,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeSwitchButton: {
    backgroundColor: "#007bff", // màu xanh nổi bật khi được chọn
  },
  switchText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  activeSwitchText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AdminScreen;
