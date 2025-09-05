import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import JobCard from '../../componets/JobCard';

const SearchResultScreen = ({ route, navigation }: any) => {
  const { query, userId } = route.params;
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    const snapshot = await getDocs(collection(db, 'jobs'));
    const filtered = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((job) => {
        const q = query.toLowerCase();
        return (
          job.title?.toLowerCase().includes(q) ||
          job.company?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q)
        );
      });
    setResults(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchJobs();
    console.log('Search query:', query);
    console.log('User ID:', userId);
  }, [query]);

  const handleJobPress = (job: any) => {
    navigation.navigate('JobDetail', { jobId: job.id , userId });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kết quả cho: "{query}"</Text>

      {results.length === 0 ? (
        <Text style={styles.emptyText}>Không tìm thấy công việc phù hợp.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobCard job={item} onPress={() => handleJobPress(item)} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: '10%',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e86de',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
