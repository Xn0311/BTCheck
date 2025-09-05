import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
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

const GoodJobScreen = ({ navigation }: any) => {
  const [fillGoodJobs, setfillGoodJobs] = useState<Job[]>([]); // công việc lương cao nhất
  const [refreshing, setRefreshing] = useState(false);

  const fetchHighestSalaryJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobsData: Job[] = [];
  
      querySnapshot.forEach((doc) => {
        const job = { id: doc.id, ...(doc.data() as Omit<Job, 'id'>) };
        jobsData.push(job);
      });
  
      // Tách chuỗi lương, lấy lương tối đa
      const jobsWithParsedSalary = jobsData.map((job) => {
        const match = job.salary?.match(/(\d+)[^\d]*(\d+)?/); // bắt "15-20"
        const maxSalary = match ? parseInt(match[2] || match[1]) : 0;
        return { ...job, maxSalary };
      });
  
      // Sắp xếp theo lương giảm dần và lấy top 5
      const top5Highest = jobsWithParsedSalary
        .sort((a, b) => b.maxSalary - a.maxSalary)
        .slice(0, 10)
  
      setfillGoodJobs(top5Highest);
    } catch (error) {
      console.error("Lỗi khi lấy công việc theo lương:", error);
    }
  };
  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHighestSalaryJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHighestSalaryJobs();
  }, []);

  const handleJobPress = (item: Job) => {
    navigation.navigate('JobDetail', { jobId: item.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Việc Làm Tốt Nhất</Text>

      {fillGoodJobs.length === 0 ? (
        <Text style={styles.emptyText}>Không có công việc nào.</Text>
      ) : (
        <FlatList
          data={fillGoodJobs}
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

export default GoodJobScreen;

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
