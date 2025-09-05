import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  ImageBackground,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import JobCard from "../../componets/JobCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatBotModal from "../../componets/ChatBotModal";
import { fetchSuggestedJobs } from "../../componets/chatbotHelper";

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

const HomeScreen = ({ navigation }: any) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [fillGoodJobs, setfillGoodJobs] = useState<Job[]>([]);
  const [desiredJobsList, setDesiredJobsList] = useState<Job[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userid1, setUserId1] = useState<string | null>(null);
  const [jobID, setJobId] = useState<string | null>(null);
  const [searchQuerynew, setSearchQuerynew] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [fullTextIndex, setFullTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const fullTextList = [
    "TTìm kiếm việc làm...",
    "TTìm kiếm theo địa điểm...",
    "TTìm kiếm theo mức lương...",
    "TTìm kiếm theo công ty...",
  ];

  const fetchJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsData: Job[] = [];
    const industrySet = new Set<string>();

    querySnapshot.forEach((doc) => {
      const job = { id: doc.id, ...(doc.data() as Omit<Job, "id">) };
      jobsData.push(job);
      if (job.industry) {
        industrySet.add(job.industry);
      }
    });

    setJobs(jobsData);
    setFilteredJobs(jobsData);
    setIndustries(Array.from(industrySet));
  };

  const fetchHighestSalaryJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsData: Job[] = [];

      querySnapshot.forEach((doc) => {
        const job = { id: doc.id, ...(doc.data() as Omit<Job, "id">) };
        jobsData.push(job);
      });

      const jobsWithParsedSalary = jobsData.map((job) => {
        const match = job.salary?.match(/(\d+)[^\d]*(\d+)?/);
        const maxSalary = match ? parseInt(match[2] || match[1]) : 0;
        return { ...job, maxSalary };
      });

      const sortedJobs = jobsWithParsedSalary
        .sort((a, b) => b.maxSalary - a.maxSalary)
        .slice(0, 3);

      setfillGoodJobs(sortedJobs);
    } catch (error) {
      console.error("Error fetching top salary jobs:", error);
    }
  };

  const fetchDesiredJobs = async () => {
    const storedUser = await AsyncStorage.getItem("currentUser");
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);
    const desiredJobs: string[] = userData.desiredJobs ?? [];

    const querySnapshot = await getDocs(collection(db, "jobs"));
    const desiredJobsData: Job[] = [];
    const industrySet = new Set<string>();

    querySnapshot.forEach((doc) => {
      const job = { id: doc.id, ...(doc.data() as Omit<Job, "id">) };
      if (desiredJobs.includes(job.specialization ?? "")) {
        desiredJobsData.push(job);
        if (job.industry) {
          industrySet.add(job.industry);
        }
      }
    });

    setDesiredJobsList(desiredJobsData);
    setIndustries((prev) => Array.from(new Set([...prev, ...industrySet])));
  };

  const getCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("currentUser");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };
  const getUserIdByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return userData.userId;
      } else {
        console.log("No user found with this email.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching userId:", error);
      return null;
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchJobs(),
      fetchDesiredJobs(),
      fetchHighestSalaryJobs(),
    ]);
    await getCurrentUser();
    setLoading(false);
    const str = await AsyncStorage.getItem("currentUser");
    const curr = JSON.parse(str || "{}");
    setUserId(curr.email);
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const str = await AsyncStorage.getItem("currentUser");
        const curr = JSON.parse(str || "{}");

        if (curr?.email) {
          setUserId(curr.email);
          const result = await getUserIdByEmail(curr.email);
          if (result) {
            setUserId1(result);
            console.log("User ID:", result);
          } else {
            console.log("Không tìm thấy userId tương ứng với email.");
          }
        }
        await Promise.all([
          fetchJobs(),
          fetchDesiredJobs(),
          fetchHighestSalaryJobs(),
        ]);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      }
      setLoading(false);
    };
    loadAllData();
  }, []);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const applyFilters = () => {
    let results = [...jobs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query)
      );
    }

    if (selectedIndustries.length > 0) {
      results = results.filter((job) =>
        selectedIndustries.includes(job.industry ?? "")
      );
    }

    setFilteredJobs(results);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedIndustries, jobs]);

  useEffect(() => {
    let typingInterval: NodeJS.Timeout;
    let delayTimeout: NodeJS.Timeout;

    const currentText = fullTextList[fullTextIndex];
    let charIndex = 0;

    // Reset placeholder ngay trước khi bắt đầu gõ lại
    setPlaceholder("");

    // Đặt một timeout nhỏ trước khi bắt đầu gõ
    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setPlaceholder((prev) => prev + currentText.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          delayTimeout = setTimeout(() => {
            setFullTextIndex(
              (prevIndex) => (prevIndex + 1) % fullTextList.length
            );
          }, 2000); // đợi 2 giây trước khi chuyển sang đoạn tiếp theo
        }
      }, 100);
    };

    const startDelay = setTimeout(startTyping, 100);
    return () => {
      clearInterval(typingInterval);
      clearTimeout(delayTimeout);
      clearTimeout(startDelay);
    };
  }, [fullTextIndex]);

  const handleJobPress = (item: Job) => {
    navigation.navigate("JobDetail", { jobId: item.id, userId: userid1 });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const menuItems = [
    { label: "Việc làm", icon: "briefcase-outline", screen: "AllJobsScreen" },
    {
      label: "Công ty",
      icon: "business-outline",
      screen: "CompanyStatsScreen",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
      </View>
    );
  }
  const jobNews = [
    {
      id: "news1",
      title: "Top 5 kỹ năng mềm được săn đón nhất năm 2025",
      summary:
        "Khả năng giao tiếp, tư duy phản biện và giải quyết vấn đề là yếu tố nhà tuyển dụng ưu tiên hàng đầu.",
      content: `Năm 2025, thị trường lao động chứng kiến sự thay đổi mạnh mẽ khi kỹ năng mềm trở thành yếu tố then chốt trong tuyển dụng. Giao tiếp hiệu quả giúp nhân viên truyền đạt ý tưởng rõ ràng và làm việc nhóm tốt hơn. Tư duy phản biện giúp xử lý vấn đề và đưa ra quyết định chính xác. Khả năng giải quyết vấn đề, quản lý thời gian và thích nghi với thay đổi cũng là những kỹ năng quan trọng. Các nhà tuyển dụng không chỉ đánh giá trình độ chuyên môn mà còn ưu tiên thái độ làm việc tích cực, tinh thần học hỏi và khả năng hợp tác. Sinh viên và người đi làm nên đầu tư phát triển kỹ năng mềm thông qua hoạt động ngoại khóa, dự án nhóm và đào tạo chuyên sâu. Đây sẽ là lợi thế cạnh tranh quan trọng trong kỷ nguyên làm việc kết hợp giữa con người và máy móc.`,
    },
    {
      id: "news2",
      title: "Lương ngành Data và AI tăng mạnh trong quý 1/2025",
      summary:
        "Data Analyst và AI Engineer trở thành nhóm ngành có mức thu nhập trung bình cao nhất hiện nay.",
      content: `Trong quý 1/2025, ngành Phân tích dữ liệu (Data Analytics) và Trí tuệ nhân tạo (AI) ghi nhận mức lương trung bình tăng từ 15% đến 25% so với năm trước. Nguyên nhân là nhu cầu tuyển dụng cao nhưng nguồn nhân lực lại khan hiếm. Các công ty công nghệ lớn và doanh nghiệp truyền thống đều đang chuyển đổi số, dẫn đến nhu cầu tuyển dụng các vị trí như Data Analyst, AI Engineer, Machine Learning Engineer tăng vọt. Mức lương khởi điểm của sinh viên mới ra trường có thể từ 18-25 triệu đồng/tháng, trong khi người có kinh nghiệm từ 2-3 năm có thể đạt 35-50 triệu/tháng. Kỹ năng được ưu tiên gồm: Python, SQL, xử lý dữ liệu lớn (Big Data), mô hình hóa và các nền tảng AI như TensorFlow, PyTorch.`,
    },
    {
      id: "news3",
      title: "Phỏng vấn nhóm: Cách gây ấn tượng mà không “chiếm sóng”",
      summary:
        "Kỹ năng lắng nghe và tương tác là chìa khóa giúp bạn nổi bật trong các buổi phỏng vấn nhóm.",
      content: `Phỏng vấn nhóm là hình thức tuyển dụng phổ biến, đặc biệt ở các công ty lớn và chương trình tuyển dụng tập trung (mass recruitment). Ứng viên cần biết cách thể hiện bản thân mà không tỏ ra lấn át hay quá cạnh tranh. Bí quyết là giữ thái độ hợp tác, lắng nghe ý kiến người khác và đóng góp xây dựng ý tưởng chung. Khi trình bày, hãy nói rõ ràng, súc tích và liên hệ đến mục tiêu chung của nhóm. Việc thể hiện sự hỗ trợ đồng đội, khuyến khích người khác phát biểu cũng là điểm cộng lớn. Tránh ngắt lời, áp đặt ý kiến hay độc chiếm cuộc thảo luận. Nhiều nhà tuyển dụng cho biết họ đánh giá cao những ứng viên có thể điều phối nhóm nhẹ nhàng và biết phát triển thảo luận mà không gây mâu thuẫn.`,
    },
    {
      id: "news4",
      title: "CV không kinh nghiệm vẫn ghi điểm: Làm thế nào?",
      summary:
        "Tập trung vào dự án cá nhân, kỹ năng mềm và các hoạt động ngoại khóa để thuyết phục nhà tuyển dụng.",
      content: `Nhiều sinh viên mới ra trường thường lo lắng vì không có kinh nghiệm làm việc chính thức. Tuy nhiên, bạn vẫn có thể gây ấn tượng bằng cách trình bày rõ ràng những kỹ năng và trải nghiệm liên quan. Hãy đưa vào CV các dự án cá nhân, bài tập nhóm, hoạt động câu lạc bộ, khóa học online và chứng chỉ chuyên môn. Nhà tuyển dụng thường quan tâm đến thái độ học hỏi, khả năng làm việc nhóm và tư duy giải quyết vấn đề hơn là số năm kinh nghiệm. Một mục tiêu nghề nghiệp rõ ràng, bố cục chuyên nghiệp và cách trình bày súc tích cũng giúp CV nổi bật. Đừng quên kiểm tra chính tả và format. Nếu có thể, hãy cá nhân hóa CV theo từng vị trí ứng tuyển để thể hiện sự quan tâm và đầu tư nghiêm túc.`,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={require("../../assets/backgroud/backgroud 3.jpg")}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}></View>
          {/* Header with Welcome */}
          <View style={styles.header}>
            {currentUser?.name ? (
              <View style={styles.userInfo}>
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color="#2e86de"
                />
                <View style={styles.welcomeContainer}>
                  <Text style={styles.greeting}>Xin chào!</Text>
                  <Text style={styles.userName}>{currentUser.name}</Text>
                </View>
              </View>
            ) : null}

            {/* <TouchableOpacity style={styles.notificationIcon}>
                <Ionicons name="notifications-outline" size={26} color="#2e86de" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity> */}
          </View>

          {/* Search Bar */}
          <View>
            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInner}>
                <Ionicons name="search" size={20} color="#6c757d" />
                <TextInput
                  placeholder={placeholder}
                  placeholderTextColor="#6c757d"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  onSubmitEditing={() => {
                    if (searchQuery.trim()) {
                      navigation.navigate("SearchResultScreen", {
                        query: searchQuery.trim(),
                        userId: userid1,
                      });
                    }
                  }}
                  returnKeyType="search"
                />

                <TouchableOpacity
                  onPress={() => {
                    if (searchQuery.trim()) {
                      navigation.navigate("SearchResultScreen", {
                        query: searchQuery.trim(),
                      });
                    }
                  }}
                >
                  <Ionicons
                    name="arrow-forward-circle"
                    size={32}
                    color="#2e86de"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quick Menu */}
          <View style={styles.menuContainer}>
            <View style={styles.menuGrid}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuCard}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon} size={28} color="#2e86de" />
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Suggested Jobs */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="thumbs-up" size={20} color="#2e86de" />
              <Text style={styles.sectionTitle}>Gợi ý việc làm phù hợp</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("SuggestedJobsScreen")}
            >
              <Text style={styles.viewAll}>Xem tất cả</Text>
              <Ionicons name="chevron-forward" size={16} color="#2e86de" />
            </TouchableOpacity>
          </View>

          {desiredJobsList.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={48} color="#ced4da" />
              <Text style={styles.emptyText}>Không có công việc phù hợp</Text>
            </View>
          ) : (
            <View style={styles.jobsContainer}>
              {desiredJobsList.slice(0, 5).map((item) => (
                <JobCard
                  key={item.id}
                  job={item}
                  onPress={() => handleJobPress(item)}
                />
              ))}
            </View>
          )}

          {/* Top Jobs */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="star" size={20} color="#2e86de" />
              <Text style={[styles.sectionTitle, { color: "#2e86de" }]}>
                Việc làm tốt nhất
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("GoodJobScreen")}
            >
              <Text style={styles.viewAll}>Xem tất cả</Text>
              <Ionicons name="chevron-forward" size={16} color="#2e86de" />
            </TouchableOpacity>
          </View>

          {fillGoodJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={48} color="#ced4da" />
              <Text style={styles.emptyText}>Không tìm thấy công việc</Text>
            </View>
          ) : (
            <View style={styles.jobsContainer}>
              {fillGoodJobs.slice(0, 5).map((item) => (
                <JobCard
                  key={item.id}
                  job={item}
                  onPress={() => handleJobPress(item)}
                />
              ))}
            </View>
          )}

          {/* All Jobs */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="list" size={20} color="#2e86de" />
              <Text style={[styles.sectionTitle, { color: "#2e86de" }]}>
                Tất cả việc làm
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("AllJobsScreen")}
            >
              <Text style={styles.viewAll}>Xem tất cả</Text>
              <Ionicons name="chevron-forward" size={16} color="#2e86de" />
            </TouchableOpacity>
          </View>

          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={48} color="#ced4da" />
              <Text style={styles.emptyText}>Không tìm thấy công việc</Text>
            </View>
          ) : (
            <View style={styles.jobsContainer}>
              {filteredJobs.slice(0, 5).map((item) => (
                <JobCard
                  key={item.id}
                  job={item}
                  onPress={() => handleJobPress(item)}
                />
              ))}
            </View>
          )}

          {/* Recruitment News */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="newspaper" size={20} color="#2e86de" />
              <Text style={[styles.sectionTitle, { color: "#2e86de" }]}>
                Tin tức tuyển dụng
              </Text>
            </View>
          </View>

          <View style={styles.newsContainer}>
            {jobNews.map((news) => (
              <TouchableOpacity
                key={news.id}
                style={styles.newsCard}
                onPress={() =>
                  navigation.navigate("NewsDetailScreen", {
                    title: news.title,
                    summary: news.summary,
                    content: news.content,
                  })
                }
              >
                <View style={styles.newsIcon}>
                  <Ionicons
                    name="newspaper-outline"
                    size={24}
                    color="#2e86de"
                  />
                </View>
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>{news.title}</Text>
                  <Text style={styles.newsSummary}>{news.summary}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#adb5bd" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 30 }} />
        </ImageBackground>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("ChatListScreen", { userId: userid1 })
        }
        // onPress={() => navigation.navigate("AddJobsScreen1")}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => setShowChat(true)}
        style={styles.chatBtn}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>🤖</Text>
      </TouchableOpacity> */}

      {/* <ChatBotModal
        visible={showChat}
        onClose={() => setShowChat(false)}
        onSearch={fetchSuggestedJobs}
      /> */}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal:  10,
    //paddingTop: 20,
    //backgroundColor: "rgba(160, 166, 180, 0.8)",
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeContainer: {
    marginLeft: 10,
  },
  greeting: {
    fontSize: 14,
    color: "#6c757d",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#343a40",
  },
  notificationIcon: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ee5253",
  },
  searchContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginRight: 20,
    marginLeft: 20,
  },
  searchInput: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: "#343a40",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 1,
    gap: 50,
  },
  menuCard: {
    width: "23%",
    alignItems: "center",
    marginBottom: 15,
  },
  menuIconContainer: {
    backgroundColor: "#e8f4ff",
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    textAlign: "center",
    color: "#495057",
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    color: "#2e86de",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAll: {
    fontSize: 14,
    color: "#2e86de",
    fontWeight: "500",
  },
  jobsContainer: {
    marginBottom: 25,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: "#adb5bd",
  },
  newsContainer: {
    marginBottom: 20,
  },
  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 20,
    marginLeft: 20,
    borderWidth: 3, // Thêm viền
    borderColor: "rgba(26, 117, 208, 0.6)", // Màu viền nhẹ
  },
  newsIcon: {
    backgroundColor: "#e8f4ff",
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 13,
    color: "#6c757d",
    lineHeight: 18,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#2e86de",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2e86de",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab1: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#2e86de",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2e86de",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e0f0ff",
    borderRadius: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
  },

  menuContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  menuList: {
    justifyContent: "center",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  chatBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "rgba(46, 134, 222, 0.8)",
    padding: 12,
    borderRadius: 50,
    elevation: 3,
  },
});
