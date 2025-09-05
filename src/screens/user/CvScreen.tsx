import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const CvScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<"cv" | "cover">("cv");
  const [cvList, setCvList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true);
      try {
        const str = await AsyncStorage.getItem("currentUser");
        const curr = str ? JSON.parse(str) : {};

        const id = curr.userId;
        const q = query(
          collection(db, "CV"),
          where("userId", "==", String(id))
        );
        const querySnapshot = await getDocs(q);
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          const rawData = doc.data();
          const cleanedData: any = {};

          Object.keys(rawData).forEach((key) => {
            const trimmedKey = key.trim(); // loại bỏ khoảng trắng đầu/cuối key
            cleanedData[trimmedKey] = rawData[key];
          });

          data.push({ id: doc.id, ...cleanedData });
        });
        setCvList(data);
      } catch (error) {
        console.error("Lỗi khi tải CV:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const str = await AsyncStorage.getItem("currentUser");
      const curr = str ? JSON.parse(str) : {};
      const id = curr.userId;
      const q = query(collection(db, "CV"), where("userId", "==", String(id)));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];

      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        const cleanedData: any = {};
        Object.keys(rawData).forEach((key) => {
          const trimmedKey = key.trim();
          cleanedData[trimmedKey] = rawData[key];
        });
        data.push({ id: doc.id, ...cleanedData });
      });

      setCvList(data);
    } catch (error) {
      console.error("Lỗi khi refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderCVItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PreviewCVScreen", {
            cvId: item.id,
            cvName: item.cvName,
          })
        }
      >
        <View style={styles.imagePlaceholder}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={32} color="#bbb" />
          )}
        </View>

        <Text style={styles.cvTitle} numberOfLines={1}>
          {item.cvName ? item.cvName : "Không có tiêu đề"}
        </Text>

        <Text style={styles.cvDate}>
          {item.createdAt?.toDate?.().toLocaleString() || "Không rõ ngày"}
        </Text>

        {/* <TouchableOpacity style={styles.downloadIcon}>
          <Ionicons name="download-outline" size={20} color="#6e6e6e" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.favoriteIcon}>
          <Ionicons name="star-outline" size={20} color="#6e6e6e" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, }}>
      <ImageBackground
        source={require("../../assets/backgroud/z6690949168172_fa8d8d1d0fbcf097856b8f693e07a8b5.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style ={{backgroundColor :"rgba(255, 255, 255, 0.5)", flex:1}}>


        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quản Lý CV</Text>
        </View>

        {tab === "cv" ? (
          loading ? (
            <View style={styles.centered}>
              <Text>Đang tải...</Text>
            </View>
          ) : cvList.length === 0 ? (
            <View style={styles.centered}>
              <Text>Chưa có CV</Text>
            </View>
          ) : (
            <FlatList
              data={cvList}
              renderItem={renderCVItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )
        ) : (
          <View style={styles.centered}>
            <Text>Chưa có cover letter</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("CreateCVScreen", { cvId: null })}
        >
          <Text style={styles.createBtnText}>+ Tạo mới CV</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CvScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 8,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#2e86de',
  },
  tabs: {
    flexDirection: "row",
    marginTop: 12,
  },
  tabText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: "#999",
  },
  activeTab: {
    color: "#2e86de",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  card: {
    backgroundColor: "#f9f9f9",
    width: "48%",
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
    position: "relative",
  },
  imagePlaceholder: {
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  cvTitle: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  cvDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  downloadIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  favoriteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  createBtn: {
    backgroundColor: "#2e86de",
    paddingVertical: 12,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
