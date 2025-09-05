import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, query, getDocs, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useRoute } from '@react-navigation/native';

const UserListScreen = ({navigation}:any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { currentUserId } = route.params as { currentUserId: string };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('id', '!=', currentUserId));
        const snapshot = await getDocs(q);
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const startChat = async (otherUser: any) => {
    const participants = [currentUserId, otherUser.id].sort();
    const chatId = participants.join('_');

    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants,
        name: otherUser.name,
        avatar: otherUser.avatar || '',
        lastMessage: '',
        time: new Date(),
        unreadCountByUser: {
          [currentUserId]: 0,
          [otherUser.id]: 0,
        },
      });
    }
    navigation.navigate('ChatScreen', {
      chatId,
      participants,
      name: otherUser.name,
    });
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn người để bắt đầu trò chuyện</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
}

export default UserListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
  },
});

