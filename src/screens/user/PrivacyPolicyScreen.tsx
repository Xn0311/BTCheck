import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔐 Chính sách Bảo mật</Text>
      <Text style={styles.description}>
        Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn.
        Dưới đây là chi tiết chính sách bảo mật áp dụng cho người dùng ứng dụng
        tìm kiếm việc làm.
      </Text>

      <Text style={styles.sectionTitle}>📑 Mục lục</Text>
      <Text style={styles.bullet}>1. Thông tin thu thập</Text>
      <Text style={styles.bullet}>2. Mục đích sử dụng thông tin</Text>
      <Text style={styles.bullet}>3. Bảo mật và lưu trữ thông tin</Text>
      <Text style={styles.bullet}>4. Quyền của người dùng</Text>
      <Text style={styles.bullet}>5. Chia sẻ thông tin</Text>
      <Text style={styles.bullet}>6. Cookie và công nghệ theo dõi</Text>
      <Text style={styles.bullet}>7. Liên hệ</Text>

      <Text style={styles.sectionTitle}>1. Thông tin thu thập</Text>
      <Text style={styles.text}>
        Khi bạn sử dụng ứng dụng, chúng tôi có thể thu thập các thông tin như:
        {"\n"}• Họ tên, email, số điện thoại, ảnh đại diện.
        {"\n"}• Hồ sơ việc làm: kinh nghiệm, kỹ năng, học vấn, CV.
        {"\n"}• Thông tin thiết bị: loại thiết bị, địa chỉ IP.
        {"\n"}• Lịch sử tìm kiếm việc làm và hành vi sử dụng.
      </Text>

      <Text style={styles.sectionTitle}>2. Mục đích sử dụng thông tin</Text>
      <Text style={styles.text}>
        • Gợi ý việc làm phù hợp với hồ sơ của bạn.
        {"\n"}• Cho phép nhà tuyển dụng liên hệ nếu bạn cho phép.
        {"\n"}• Cải thiện trải nghiệm người dùng và tính năng của ứng dụng.
        {"\n"}• Gửi thông báo việc làm mới, thay đổi từ hệ thống.
      </Text>

      <Text style={styles.sectionTitle}>3. Bảo mật và lưu trữ thông tin</Text>
      <Text style={styles.text}>
        • Thông tin cá nhân của bạn được mã hóa và lưu trữ an toàn trên máy chủ
        của chúng tôi.
        {"\n"}• Chúng tôi áp dụng các biện pháp bảo mật như xác thực đa yếu tố,
        phân quyền truy cập và sao lưu định kỳ.
        {"\n"}• Dữ liệu được lưu giữ trong thời gian bạn còn sử dụng dịch vụ,
        hoặc theo yêu cầu pháp luật.
      </Text>

      <Text style={styles.sectionTitle}>4. Quyền của người dùng</Text>
      <Text style={styles.text}>
        • Truy cập, cập nhật hoặc xóa thông tin cá nhân.
        {"\n"}• Thu hồi sự đồng ý chia sẻ dữ liệu.
        {"\n"}• Yêu cầu hạn chế xử lý hoặc xuất dữ liệu cá nhân.
        {"\n"}Bạn có thể thực hiện các quyền này trong phần “Tài khoản” hoặc
        liên hệ với chúng tôi.
      </Text>

      <Text style={styles.sectionTitle}>5. Chia sẻ thông tin</Text>
      <Text style={styles.text}>
        • Chúng tôi chỉ chia sẻ thông tin của bạn với nhà tuyển dụng khi có sự
        đồng ý.
        {"\n"}• Không chia sẻ, bán hoặc cho thuê thông tin cá nhân cho bên thứ
        ba mà không có sự đồng ý của bạn.
      </Text>

      <Text style={styles.sectionTitle}>6. Cookie và công nghệ theo dõi</Text>
      <Text style={styles.text}>
        • Chúng tôi sử dụng cookie và công nghệ phân tích để cải thiện hiệu suất
        và hiểu rõ hành vi người dùng.
        {"\n"}• Bạn có thể tùy chỉnh cài đặt cookie trong thiết bị hoặc trình
        duyệt.
      </Text>

      <Text style={styles.sectionTitle}>7. Liên hệ</Text>
      <Text style={styles.text}>
        Nếu bạn có thắc mắc hoặc khiếu nại liên quan đến bảo mật, vui lòng liên
        hệ:
        {"\n"}📧 Email: support@timviecapp.vn
        {"\n"}📞 SĐT: 1900 999 123
      </Text>

      <Text style={styles.footer}>Phiên bản cập nhật: 10/06/2025</Text>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#34495e",
  },
  text: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  bullet: {
    fontSize: 14,
    color: "#555",
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});
