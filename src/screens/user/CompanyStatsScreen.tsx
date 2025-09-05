import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

type Company = {
  name: string;
  logo: string;
  industry: string;
  jobCount: number;
};

const CompanyStatsScreen = ({navigation} : any) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyJobCounts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'jobs'));
        const companyMap: { [name: string]: Company } = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const name = data.company ?? 'Không rõ công ty';
          const industry = data.industry ?? 'Chưa rõ ngành';
          const logo = data.logo ?? 'https://cdn-icons-png.flaticon.com/512/847/847969.png'; // fallback icon

          if (!companyMap[name]) {
            companyMap[name] = {
              name,
              logo,
              industry,
              jobCount: 1,
            };
          } else {
            companyMap[name].jobCount += 1;
          }
        });

        const companyList = Object.values(companyMap);
        setCompanies(companyList);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu công ty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobCounts();
  }, []);

  const renderItem = ({ item }: { item: Company }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CompanyDetailScreen', item)} style={styles.card}>
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.industry}>{item.industry}</Text>
        <View style={styles.jobTag}>
          <Text style={styles.jobText}>{item.jobCount} việc làm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Thương hiệu nổi bật</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default CompanyStatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  industry: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  jobTag: {
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobText: {
    fontSize: 12,
    color: '#0284c7',
  },
  followButton: {
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ecfdf5',
  },
  followText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 13,
  },
});
