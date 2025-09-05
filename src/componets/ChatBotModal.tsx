import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<string[]>;
}

const ChatBotModal: React.FC<Props> = ({ visible, onClose, onSearch }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);

    const jobTitles = await onSearch(input);

    const botText =
      jobTitles.length > 0
        ? `🤖 Gợi ý công việc:\n- ${jobTitles.join("\n- ")}`
        : `🤖 Xin lỗi, tôi không tìm thấy việc phù hợp.`;

    setMessages((prev) => [...prev, { from: "bot", text: botText }]);
    setInput("");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Text style={item.from === "user" ? styles.userMsg : styles.botMsg}>
              {item.text}
            </Text>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Bạn muốn làm gì?"
            style={styles.input}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={{ color: "#fff" }}>Gửi</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={{ color: "#fff" }}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChatBotModal;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  inputRow: { flexDirection: "row", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sendBtn: {
    padding: 10,
    backgroundColor: "#007bff",
    marginLeft: 8,
    borderRadius: 8,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },
  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
  },
  botMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
  },
});
