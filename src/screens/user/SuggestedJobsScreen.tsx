import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobCard from '../../componets/JobCard';

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  logo?: string;
  description?: string;
  requirements?: string;
  industry?: string;
  specialization?: string;
}

const SuggestedJobsScreen = ({ navigation }: any) => {
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSuggestedJobs = async () => {
    const storedUser = await AsyncStorage.getItem('currentUser');
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);
    const desiredSpecializations: string[] = userData.desiredJobs ?? [];

    const querySnapshot = await getDocs(collection(db, 'jobs'));
    const filteredJobs: Job[] = [];

    querySnapshot.forEach((doc) => {
      const job = { id: doc.id, ...(doc.data() as Omit<Job, 'id'>) };
      if (desiredSpecializations.includes(job.specialization ?? '')) {
        filteredJobs.push(job);
      }
    });

    setSuggestedJobs(filteredJobs);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSuggestedJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSuggestedJobs();
  }, []);

  const handleJobPress = (item: Job) => {
    navigation.navigate('JobDetail', { jobId: item.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gợi ý việc làm phù hợp</Text>

      {suggestedJobs.length === 0 ? (
        <Text style={styles.emptyText}>Không có công việc phù hợp.</Text>
      ) : (
        <FlatList
          data={suggestedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobCard job={item} onPress={() => handleJobPress(item)} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
};

export default SuggestedJobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: '10%',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e86de',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
