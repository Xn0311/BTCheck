import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { db } from "../../config/FirebaseConfig";
import JobCard from "../../componets/JobCard";

interface Job {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  companyAddress: string;
  workplace: string;
  salary: string;
  location: string;
  logo?: string;
  experience?: string;
  description?: string;
  benefits?: string[];
  requirements?: string[];
  specialization?: string[];
  industry?: string;
  createdAt?: any;
}

const formatDate = (createdAt: any) => {
  try {
    const date =
      typeof createdAt === "string"
        ? new Date(createdAt)
        : new Date(createdAt.seconds * 1000);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `Ngày ${day} tháng ${month} năm ${year}`;
  } catch {
    return "Không rõ ngày";
  }
};

const JobDetailScreen = ({ navigation }: any) => {
  type JobDetailRouteProp = RouteProp<
    { params: { jobId: string; userId: string } },
    "params"
  >;
  const route = useRoute<JobDetailRouteProp>();
  const { jobId, userId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [desiredJobsList, setDesiredJobsList] = useState<Job[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  useEffect(() => {
    console.log("JobDetailScreen mounted with jobId:", jobId);
    console.log("UserId:", userId);
    console.log("CompanyID:", companyId);
    console.log("DesiredJobsList:", job);
    const fetchJob = async () => {
      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...(jobSnap.data() as Job) });
        } else {
          console.warn("Không tìm thấy công việc!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết công việc:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDesiredJobs = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (!storedUser) {
          console.warn("Không tìm thấy người dùng");
          return;
        }
        const userData = JSON.parse(storedUser);
        const desiredJobs: string[] = userData.desiredJobs ?? [];
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const desiredJobsData: Job[] = [];
        const industrySet = new Set<string>();

        querySnapshot.forEach((doc) => {
          const job = { id: doc.id, ...(doc.data() as Omit<Job, "id">) };

          const jobSpecs = Array.isArray(job.specialization)
            ? job.specialization
            : job.specialization
            ? [job.specialization]
            : [];

          if (jobSpecs.some((s) => desiredJobs.includes(s))) {
            desiredJobsData.push(job);
            if (job.industry) {
              industrySet.add(job.industry);
            }
          }
        });

        setDesiredJobsList(desiredJobsData);
        setIndustries((prev) => Array.from(new Set([...prev, ...industrySet])));
      } catch (err) {
        console.error("Lỗi khi lấy gợi ý jobs:", err);
      }
    };

    fetchJob();
    fetchDesiredJobs();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (!storedUser) {
        alert("Bạn cần đăng nhập để ứng tuyển");
        return;
      }
      const userData = JSON.parse(storedUser);
      const applicationRef = collection(db, "applications");
      await addDoc(applicationRef, {
        userId: userId,
        jobId: job?.id,
        applyTime: new Date(),
        status: "applied",
        jobTitle: job?.title,
        company: job?.company,
        companyId: job?.companyId ?? null,
        companyAddress: job?.companyAddress,
      });

      alert("Bạn đã nộp đơn thành công!");
      console.log("Companyid:", companyId);
    } catch (error) {
      console.error("Lỗi khi nộp đơn:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleSave = () => {
    alert("Công việc đã được lưu!");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy công việc!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f4f8" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image
            source={
              job.logo
                ? { uri: job.logo }
                : require("../../assets/avata/error.jpg")
            }
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="cash" size={36} color="#2e86de" />
              <Text style={styles.infoText}>
                {job.salary || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="map-marker"
                size={36}
                color="#2e86de"
              />
              <Text style={styles.infoText}>
                {job.location || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="briefcase"
                size={36}
                color="#2e86de"
              />
              <Text style={styles.infoText}>
                {job.experience || "Chưa cập nhật"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailContainer}>
          {job.industry && (
            <Text style={styles.label}>
              Ngành nghề: <Text style={styles.value}>{job.industry}</Text>
            </Text>
          )}
          {job.specialization && (
            <Text style={styles.label}>
              Yêu cầu chuyên môn về:{" "}
              <Text style={styles.value}>{job.specialization}</Text>
            </Text>
          )}
          {job.createdAt && (
            <Text style={styles.label}>
              Ngày đăng:{" "}
              <Text style={styles.value}>{formatDate(job.createdAt)}</Text>
            </Text>
          )}

          {job.description && (
            <>
              <Text style={styles.sectionTitle}>Mô tả công việc</Text>
              <Text style={styles.text}>{job.description}</Text>
            </>
          )}

          {job.requirements?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Yêu cầu</Text>
              {job.requirements.map((item, index) => (
                <Text key={index} style={styles.bulletText}>
                  - {item}
                </Text>
              ))}
            </>
          )}
          {job.benefits?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Quyền Lợi</Text>
              {job.benefits.map((item, index) => (
                <Text key={index} style={styles.bulletText}>
                  - {item}
                </Text>
              ))}
            </>
          )}
          {job.companyAddress && (
            <>
              <Text style={styles.label}>
                Địa điểm làm việc:{" "}
                <Text style={styles.value}>{job.companyAddress}</Text>
              </Text>
            </>
          )}
        </View>

        {/* Gợi ý việc làm phù hợp */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gợi ý việc làm phù hợp</Text>
        </View>
        {desiredJobsList.length === 0 ? (
          <Text style={{ textAlign: "center", marginBottom: 20 }}>
            Không có công việc phù hợp.
          </Text>
        ) : (
          desiredJobsList
            .slice(0, 5)
            .map((item) => (
              <JobCard
                key={item.id}
                job={item}
                onPress={() => navigation.push("JobDetail", { jobId: item.id })}
              />
            ))
        )}
      </ScrollView>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.buttonText}>Ứng tuyển ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    backgroundColor: "#f9fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafc",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 6,
    textAlign: "center",
  },
  company: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 16,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  infoBox: {
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
    tintColor: "#3b82f6",
    resizeMode: "contain",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    textAlign: "center",
  },
  detailContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 0,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    color: "#334155",
    marginBottom: 6,
  },
  value: {
    fontWeight: "400",
    color: "#475569",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    color: "#1e293b",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingBottom: 4,
  },
  text: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginLeft: 12,
  },
  bulletText: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 22,
    marginLeft: 16,
    marginBottom: 8,
  },
  footerButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  applyButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    flex: 1,
    marginLeft: 12,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveButton: {
    backgroundColor: "#64748b",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    flex: 1,
    marginRight: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  viewAll: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 15,
  },
  suggestedJobCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
