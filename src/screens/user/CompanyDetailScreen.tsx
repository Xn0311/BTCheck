import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

type CompanyDetailRouteProp = RouteProp<
  { params: { name: string; logo: string; industry: string } },
  'params'
>;

type Job = {
  id: string;
  title: string;
  location: string;
  experience: string;
};

const CompanyDetailScreen = () => {
  const route = useRoute<CompanyDetailRouteProp>();
  const { name, logo, industry } = route.params;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('company', '==', name));
        const snapshot = await getDocs(q);
        const jobList: Job[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          jobList.push({
            id: doc.id,
            title: data.title,
            location: data.location ?? 'Chưa rõ',
            experience: data.experience ?? 'Không yêu cầu',
          });
        });

        setJobs(jobList);
      } catch (error) {
        console.error('Lỗi lấy job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: logo }} style={styles.logo} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.industry}>{industry}</Text>
        </View>
      </View>

      <Text style={styles.title}>Danh sách việc làm</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 30 }} />
      ) : jobs.length === 0 ? (
        <Text style={styles.empty}>Hiện tại chưa có việc làm từ công ty này.</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7} style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <View style={styles.jobInfoRow}>
                <Text style={styles.jobDetailLabel}>Địa điểm:</Text>
                <Text style={styles.jobDetailValue}>{item.location}</Text>
              </View>
              <View style={styles.jobInfoRow}>
                <Text style={styles.jobDetailLabel}>Kinh nghiệm:</Text>
                <Text style={styles.jobDetailValue}>{item.experience}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CompanyDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  logoContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    width: 70,
    height: 70,
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  industry: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
  },
  jobCard: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  jobInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  jobDetailLabel: {
    fontWeight: '600',
    color: '#555',
    width: 90,
  },
  jobDetailValue: {
    color: '#666',
    flexShrink: 1,
  },
  empty: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  separator: {
    height: 12,
  },
});
