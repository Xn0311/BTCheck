import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import { Platform, ActionSheetIOS } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import MultiSelect from "react-native-multiple-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { storage, db } from "../../config/FirebaseConfig";

const UserScreen = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [availableJobSpecializations, setAvailableJobSpecializations] =
    useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [workExp, setWorkExp] = useState<string[]>([]);
  const [jobDesires, setJobDesires] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isJobSeeking, setIsJobSeeking] = useState(false);
  const [isContactAllowed, setIsContactAllowed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullNameModalVisible, setFullNameModalVisible] = useState(false);
  const [avatarsmodalVisible, setAvatarsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string>("");
  const [textValue, setTextValue] = useState("");
  const [userId, setUserId] = useState<any>(null);
  const [userid1, setUserId1] = useState<string | null>(null);

  const OPTIONS: Record<string, string[]> = {
    workExperience: [
      "Chưa có kinh nghiệm",
      "Dưới 1 năm",
      "1-2 năm",
      "3-5 năm",
      "Trên 5 năm",
    ],
    desiredJobs: availableJobSpecializations,
    desiredLocations: [
      "An Giang",
      "Bà Rịa - Vũng Tàu",
      "Bạc Liêu",
      "Bắc Giang",
      "Bắc Kạn",
      "Bắc Ninh",
      "Bến Tre",
      "Bình Dương",
      "Bình Định",
      "Bình Phước",
      "Bình Thuận",
      "Cà Mau",
      "Cao Bằng",
      "Cần Thơ",
      "Đà Nẵng",
      "Đắk Lắk",
      "Đắk Nông",
      "Điện Biên",
      "Đồng Nai",
      "Đồng Tháp",
      "Gia Lai",
      "Hà Giang",
      "Hà Nam",
      "Hà Nội",
      "Hà Tĩnh",
      "Hải Dương",
      "Hải Phòng",
      "Hậu Giang",
      "Hòa Bình",
      "Hưng Yên",
      "Khánh Hòa",
      "Kiên Giang",
      "Kon Tum",
      "Lai Châu",
      "Lạng Sơn",
      "Lào Cai",
      "Lâm Đồng",
      "Long An",
      "Nam Định",
      "Nghệ An",
      "Ninh Bình",
      "Ninh Thuận",
      "Phú Thọ",
      "Phú Yên",
      "Quảng Bình",
      "Quảng Nam",
      "Quảng Ngãi",
      "Quảng Ninh",
      "Quảng Trị",
      "Sóc Trăng",
      "Sơn La",
      "Tây Ninh",
      "Thái Bình",
      "Thái Nguyên",
      "Thanh Hóa",
      "Thừa Thiên Huế",
      "Tiền Giang",
      "TP.HCM",
      "Trà Vinh",
      "Tuyên Quang",
      "Vĩnh Long",
      "Vĩnh Phúc",
      "Yên Bái",
    ],
  };
  const SELECT_LIMIT: Record<string, number> = {
    workExperience: 1,
    desiredJobs: 3,
    desiredLocations: 3,
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Xin cấp quyền", "Vui lòng cho phép truy cập thư viện ảnh");
      }
    })();

    const load = async () => {
      const str = await AsyncStorage.getItem("currentUser");
      const curr = JSON.parse(str || "{}");
      setUserId(curr.email);

      // Lấy thông tin user
      const q = query(
        collection(db, "users"),
        where("userId", "==", curr.userId)
      );
      setUserId1(curr.userId);
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        const data = d.data();

        setAvatar(data.avatarUrl || null);
        setUserData({ ...data, docId: d.id });
        setWorkExp(data.workExperience || []);
        setJobDesires(data.desiredJobs || []);
        setLocations(data.desiredLocations || []);
        setIsJobSeeking(data.isJobSeeking ?? false);
        setIsContactAllowed(data.isContactAllowed ?? true);
      }

      // Lấy danh sách specialization từ bảng jobs để gợi ý cho desiredJobs
      const jobSnap = await getDocs(collection(db, "jobs"));
      const specsSet = new Set<string>();
      jobSnap.forEach((doc) => {
        const job = doc.data();
        if (job.specialization) {
          specsSet.add(job.specialization);
        }
      });

      // Cập nhật danh sách gợi ý desiredJobs (ví dụ: để hiển thị ra dropdown, hoặc so sánh)
      const uniqueSpecializations = Array.from(specsSet);
      setAvailableJobSpecializations(uniqueSpecializations); // bạn cần tạo state này nếu cần
    };

    load();
  }, []);

  const onHelpPress = () => {
    Alert.alert(
      "Thông tin hỗ trợ",
      "Bạn có thể liên hệ với chúng tôi qua:\n\nĐiện thoại: 1900 1234\nEmail: hotro@company.com",
      [{ text: "Đóng" }]
    );
  };

  const [user, setUser] = useState(null);
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const savedUser = await AsyncStorage.getItem("currentUser");
        if (!savedUser) {
          console.error(
            "Không tìm thấy thông tin người dùng trong AsyncStorage."
          );
          return;
        }

        const parsedUser = JSON.parse(savedUser);
        const email = parsedUser?.email?.trim().toLowerCase();
        const uri = result.assets[0].uri;

        if (email && uri) {
          setAvatar(uri); // cập nhật UI

          const userRef = doc(db, "users", email);
          await updateDoc(userRef, {
            avatarUrl: uri,
          });

          console.log("✅ Avatar updated successfully in Firestore.");
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi chọn hoặc cập nhật avatar:", error);
    }
  };

  const openAvatarModal = () => setAvatarModalVisible(true);

  const openEditor = (field: string) => {
    if (field === "fullName") {
      setCurrentField(field);
      setTextValue(userData?.fullName || "");
      setFullNameModalVisible(true);
    } else {
      setCurrentField(field);
      setModalVisible(true);
    }
  };

  const saveTextField = async () => {
    if (!userData) return;
    await updateDoc(doc(db, "users", userData.docId), { fullName: textValue });
    setUserData((u) => ({ ...u, fullName: textValue }));
    setModalVisible(false);
  };

  const saveMulti = async (items: string[]) => {
    if (!userData) return;
    await updateDoc(doc(db, "users", userData.docId), {
      [currentField]: items,
    });
    if (currentField === "workExperience") setWorkExp(items);
    if (currentField === "desiredJobs") setJobDesires(items);
    if (currentField === "desiredLocations") setLocations(items);
    setModalVisible(false);
  };

  const renderField = (field: string, label: string, value: string[]) => (
    <View style={styles.infoBlock} key={field}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Ionicons
            name={
              field === "workExperience"
                ? "briefcase"
                : field === "desiredJobs"
                ? "rocket"
                : "location"
            }
            size={20}
            color="#2e86de"
          />
          <Text style={styles.label}> {label}</Text>
        </View>
        <TouchableOpacity onPress={() => openEditor(field)}>
          <Text style={styles.editText}>Sửa</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.tag}>{value.join(", ") || "Chưa cập nhật..."}</Text>
      </View>
    </View>
  );
  const handleFieldSelect = (field: string, items: string[]) => {
    const limit = SELECT_LIMIT[field];
    if (items.length > limit) {
      Alert.alert("Giới hạn", `Bạn chỉ được chọn tối đa ${limit} mục.`);
      return;
    }
    if (field === "workExperience") setWorkExp(items);
    if (field === "desiredJobs") setJobDesires(items);
    if (field === "desiredLocations") setLocations(items);
  };
  const getLabel = (field: string) => {
    switch (field) {
      case "workExperience":
        return "Kinh nghiệm làm việc";
      case "desiredJobs":
        return "Công việc mong muốn";
      case "desiredLocations":
        return "Địa điểm làm việc mong muốn";
      default:
        return "";
    }
  };

  const saveField = async (items: string[]) => {
    if (!userData?.docId) return;
    await updateDoc(doc(db, "users", userData.docId), {
      [currentField]: items,
    });
    Alert.alert("Cập nhật thành công");
    if (currentField === "workExperience") setWorkExp(items);
    if (currentField === "desiredJobs") setJobDesires(items);
    if (currentField === "desiredLocations") setLocations(items);
    setModalVisible(false);
  };

  const getValue = (field: string) => {
    if (field === "workExperience") return workExp;
    if (field === "desiredJobs") return jobDesires;
    return locations;
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

  const handleAvatarPress = () => {
    const options = ["Xem ảnh đại diện", "Thay đổi ảnh đại diện", "Hủy"];
    const cancelButtonIndex = 2;
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            setAvatarsModalVisible(true);
          } else if (buttonIndex === 1) {
            pickImage();
          }
        }
      );
    } else {
      Alert.alert("Chọn hành động", "", [
        {
          text: "Xem ảnh đại diện",
          onPress: () => setAvatarsModalVisible(true),
        },
        { text: "Thay đổi ảnh đại diện", onPress: () => pickImage() },
        { text: "Hủy", style: "cancel" },
      ]);
    }
  };
  const confirmDisableAccount = async (userId: string, navigation: any) => {
    Alert.alert(
      "Cảnh báo",
      "Bạn có chắc chắn muốn vô hiệu hóa tài khoản không?",

      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Tiếp tục",
          onPress: () => {
            Alert.alert(
              "Xác nhận cuối cùng",
              "Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn. Bạn chắc chắn?",

              [
                { text: "Không", style: "cancel" },
                {
                  text: "Vô hiệu hóa",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteDoc(doc(db, "users", userId));
                      await AsyncStorage.removeItem("userId");
                      Alert.alert("Tài khoản đã được xóa khỏi hệ thống");
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "LoginScreen" }],
                      });
                    } catch (error) {
                      console.error("Lỗi xóa tài khoản:", error);
                      Alert.alert(
                        "Lỗi",
                        "Không thể xóa tài khoản. Vui lòng thử lại."
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/backgroud/z6690949168172_fa8d8d1d0fbcf097856b8f693e07a8b5.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleAvatarPress}>
                <Image
                  source={
                    avatar
                      ? { uri: avatar }
                      : require("../../assets/avata/avatar-trang.jpg")
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {userData?.fullName || "Chưa có tên"}
                </Text>
                <TouchableOpacity onPress={() => openEditor("fullName")}>
                  <Ionicons
                    name="pencil"
                    size={18}
                    color="#2e86de"
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.id}>ID: {userData?.userId || "..."}</Text>
            </View>

            {renderField("workExperience", "Kinh nghiệm làm việc", workExp)}
            {renderField("desiredJobs", "Công việc mong muốn", jobDesires)}
            {renderField(
              "desiredLocations",
              "Địa điểm làm việc mong muốn",
              locations
            )}

            <View style={styles.infoBlock}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <Ionicons name="stats-chart" size={20} color="green" />
                  <Text style={styles.label}> Trạng thái tìm việc</Text>
                </View>
                <Switch
                  value={isJobSeeking}
                  onValueChange={async (v) => {
                    setIsJobSeeking(v);
                    if (userData)
                      await updateDoc(doc(db, "users", userData.docId), {
                        isJobSeeking: v,
                      });
                  }}
                />
              </View>
            </View>
            <View style={styles.infoBlock}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <Ionicons name="chatbox-ellipses" size={20} color="green" />
                  <Text style={styles.label}> Cho phép NTD liên hệ</Text>
                </View>
                <Switch
                  value={isContactAllowed}
                  onValueChange={async (v) => {
                    setIsContactAllowed(v);
                    if (userData)
                      await updateDoc(doc(db, "users", userData.docId), {
                        isContactAllowed: v,
                      });
                  }}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text>NTD có thể liên hệ:</Text>
                <Text>✅ Email, SĐT</Text>
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Cài đặt tài khoản</Text>
            </View>
            {[
              { label: "Đổi mật khẩu", icon: "key" },
              { label: "Bảo mật", icon: "shield-checkmark" },
              { label: "Vô hiệu hóa", icon: "lock-closed" },
              { label: "Xem thông tin ứng tuyển", icon: "create" },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.settingItem}
                onPress={() => {
                  if (item.label === "Vô hiệu hóa") {
                    confirmDisableAccount(userData?.userId, navigation);
                  } else if (item.label === "Bảo mật") {
                    navigation.navigate("PrivacyPolicyScreen");
                  } else if (item.label === "Xem thông tin ứng tuyển") {
                    navigation.navigate("AppliedJobsScreen", {
                      userId: userid1,
                    });
                  } else {
                    navigation.navigate(
                      item.label === "Đổi mật khẩu"
                        ? "ChangePasswordScreen"
                        : "EditProfile"
                    );
                  }
                }}
              >
                <Ionicons name={item.icon} size={20} color="#2e86de" />
                <Text style={styles.settingText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Chính sách & Hỗ trợ</Text>
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={onHelpPress}>
              <Ionicons name="call" size={20} color="#2e86de" />
              <Text style={styles.settingText}>Trợ giúp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}> Đăng xuất</Text>
            </TouchableOpacity>

            {/* Avatar Modal */}
            <Modal
              visible={avatarsmodalVisible}
              transparent
              animationType="fade"
            >
              <View style={styles.modalContainer}>
                <Pressable
                  style={styles.modalBackground}
                  onPress={() => setAvatarsModalVisible(false)}
                >
                  <Image
                    source={
                      avatar
                        ? { uri: avatar }
                        : require("../../assets/avata/avatar-trang.jpg") // fallback ảnh mặc định
                    }
                    style={styles.fullAvatar}
                    resizeMode="contain"
                  />
                </Pressable>
              </View>
            </Modal>

            {/* Edit Fullname Modal */}
            <Modal
              visible={fullNameModalVisible}
              transparent
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Thay Đổi Tên</Text>
                  <TextInput
                    style={styles.textInput}
                    value={textValue}
                    onChangeText={setTextValue}
                    placeholder="Nhập tên mới"
                  />
                  <TouchableOpacity
                    style={styles.modalSaveBtn}
                    onPress={saveTextField}
                  >
                    <Text style={styles.saveText}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFullNameModalVisible(false)}
                    style={styles.modalCancelBtn}
                  >
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Modal Editor */}
            <Modal visible={modalVisible} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {getLabel(currentField)}
                  </Text>
                  {/* Giới hạn chiều cao MultiSelect */}
                  <View style={{ maxHeight: 300 }}>
                    <ScrollView nestedScrollEnabled>
                      <MultiSelect
                        items={(OPTIONS[currentField] ?? []).map((i) => ({
                          id: i,
                          name: i,
                        }))}
                        uniqueKey="id"
                        onSelectedItemsChange={(items) =>
                          handleFieldSelect(currentField, items)
                        }
                        selectedItems={getValue(currentField)}
                        selectText={`Chọn (max ${SELECT_LIMIT[currentField]})`}
                        hideSubmitButton
                        displayKey="name"
                        selectLimit={SELECT_LIMIT[currentField]}
                        itemTextColor="#333"
                        tagTextColor="#2e86de"
                        styleDropdownMenuSubsection={styles.dropdown}
                        styleListItemText={styles.listItemText}
                        tagContainerStyle={styles.tagContainer}
                      />
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    style={styles.modalSaveBtn}
                    onPress={() => saveField(getValue(currentField))}
                  >
                    <Text style={styles.saveText}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCancelBtn}
                  >
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  header: { alignItems: "center", margin: 16 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2e86de",
    borderRadius: 20,
    padding: 5,
  },
  nameRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  name: { fontSize: 25, fontWeight: "600" },
  id: { color: "gray", marginTop: 4, fontSize: 16 },
  infoBlock: { paddingHorizontal: 16, marginBottom: 12 },
  label: { fontWeight: "600", fontSize: 18 },
  editText: { color: "#2e86de", fontWeight: "500" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 6,
    marginTop: 6,
  },
  contactInfo: { marginLeft: 28, marginTop: 10 },
  sectionHeader: { paddingHorizontal: 16, marginTop: 20, marginBottom: 8 },
  sectionHeaderText: { fontSize: 18, fontWeight: "600" },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  settingText: { marginLeft: 8 },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 8,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalSaveBtn: {
    backgroundColor: "#2e86de",
    padding: 10,
    borderRadius: 6,
    marginTop: 12,
    alignItems: "center",
  },
  modalCancelBtn: { marginTop: 8, alignItems: "center" },

  saveText: { color: "white", fontWeight: "600" },

  avatarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarModalContent: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLarge: { width: "100%", height: "100%", resizeMode: "contain" },
  avatarModalButtons: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
  },
  modalBtn: {
    backgroundColor: "rgba(46,134,222,0.8)",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 6,
  },
  dropdown: { paddingHorizontal: 0 },
  listItemText: { fontSize: 14 },
  tagContainer: { maxWidth: "70%" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullAvatar: {
    width: "90%",
    height: "90%",
    alignSelf: "center",
    borderRadius: 15,
  },
});
