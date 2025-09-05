import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const ChatListScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdStr = String(userId);

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", userIdStr),
      orderBy("time", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const chatsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.participants && data.participants.includes(userIdStr)) {
            let formattedTime = "";
            if (data.time) {
              formattedTime = formatTime(data.time);
            }

            // Xác định bạn là công ty hay ứng viên
            // Ví dụ: giả sử participants[0] luôn là công ty, participants[1] là ứng viên
            // Nếu userId trùng participants[0] => bạn là công ty, ngược lại là ứng viên
            const isCompany = data.participants[0] === userIdStr;

            // Lấy tên và avatar hiển thị cho người đối diện
            const chatName = isCompany
              ? data.Username || "Ứng viên"
              : data.companyname || "Công ty";

            const chatAvatar = isCompany
              ? data.avataruser || "https://i.pravatar.cc/150?img=1"
              : data.avatacompany || "https://i.pravatar.cc/150?img=2";

            chatsData.push({
              id: doc.id,
              name: chatName,
              avatar: chatAvatar,
              lastMessage: data.lastMessage || "",
              time: formattedTime,
              unreadCount: data.unreadCountByUser?.[userIdStr] || 0,
              participants: data.participants || [],
            });
          }
        });

        setChats(chatsData);
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const formatTime = (timestamp) => {
    try {
      if (typeof timestamp.toDate === "function") {
        const date = timestamp.toDate();
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Vừa xong";
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays === 1) return "Hôm qua";

        return date.toLocaleDateString("vi-VN");
      }
      return "Không xác định";
    } catch (error) {
      console.error("Lỗi định dạng thời gian:", error);
      return "";
    }
  };

  const filteredData = chats.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          chatId: item.id,
          name: item.name,
          participants: item.participants,
          userId: userId,
        })
      }
    >
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
        defaultSource={require("../../assets/avata/avatar-trang.jpg")}
      />
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text
          style={[
            styles.chatMessage,
            item.unreadCount > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Đang tải cuộc trò chuyện...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/avata/2346187.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>Bạn chưa có cuộc trò chuyện nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  searchInput: {
    marginTop: "10%",
    height: 45,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  chatItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#eee",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  chatMessage: {
    color: "#777",
    marginTop: 5,
    fontSize: 14,
  },
  unreadMessage: {
    color: "#000",
    fontWeight: "500",
  },
  time: {
    fontSize: 12,
    color: "#999",
    position: "absolute",
    right: 15,
    top: 15,
  },
  unreadBadge: {
    position: "absolute",
    left: 50,
    top: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 90,
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyImage: {
    width: 200,
    height: 200,
    opacity: 0.7,
    marginBottom: 30,
  },
});

export default ChatListScreen;
