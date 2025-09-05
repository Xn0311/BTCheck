import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

type Message = {
  id: string;
  text: string;
  sender: string;
  time?: any;
  userId?: string;
};

const ChatScreen = () => {
  const route = useRoute();
  const { chatId, participants, name, userId } = route.params as {
    chatId: string;
    participants: string[];
    name: string;
    userId: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Hàm hiển thị thông báo khi nhận tin nhắn mới
  const showLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("time", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(loadedMessages);

      const lastMessage = loadedMessages[loadedMessages.length - 1];
      if (lastMessage && lastMessage.userId !== userId) {
        showLocalNotification(`Tin nhắn mới từ ${name}`, lastMessage.text);
      }

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: messageText,
        sender: userId,
        userId,
        time: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: messageText,
        time: serverTimestamp(),
      });

      setInputText("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.userId === userId;
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={[styles.messageText, isMe && styles.myText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhắn gì đó..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f4f8",
  },
  messageList: {
    marginTop: "6%",
    padding: 12,
    paddingBottom: 100,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4a90e2",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  myText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: "#333",
    marginBottom: 10,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default ChatScreen;
