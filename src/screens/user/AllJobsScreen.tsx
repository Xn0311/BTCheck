import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import JobCard from "../../componets/JobCard";

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

const AllJobsScreen = ({ navigation }: any) => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobs: Job[] = [];

    querySnapshot.forEach((doc) => {
      const job = { id: doc.id, ...(doc.data() as Omit<Job, "id">) };
      jobs.push(job);
    });

    setAllJobs(jobs);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleJobPress = (item: Job) => {
    navigation.navigate("JobDetail", { jobId: item.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tất cả việc làm</Text>

      {allJobs.length === 0 ? (
        <Text style={styles.emptyText}>Không có công việc nào.</Text>
      ) : (
        <FlatList
          data={allJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => handleJobPress(item)} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
};

export default AllJobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "10%",
    paddingHorizontal: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2e86de",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
