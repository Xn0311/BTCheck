import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const AddJobsScreen = () => {
  const [loading, setLoading] = useState(false);

  const experienceLevels = [
    "Không yêu cầu",
    "Dưới 1 năm",
    "1-2 năm",
    "3-5 năm",
    "Trên 5 năm",
  ];
  const sampleJobs = [
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Quản lý dự án đầu tư",
      title: "Chuyên Viên Phát Triển Dự Án - 3-5 năm kinh nghiệm",
      salary: "Thoả thuận",
      experience: "3-5 năm",
      description:
        "Tham gia nghiên cứu, đề xuất và triển khai các dự án đầu tư. Hỗ trợ xây dựng kế hoạch, báo cáo khả thi, hồ sơ pháp lý và giám sát tiến độ thực hiện các dự án. Phối hợp với các bộ phận liên quan và đối tác để thúc đẩy quá trình phát triển dự án. Tham gia thẩm định hiệu quả đầu tư, phân tích rủi ro và đề xuất giải pháp tối ưu. Cập nhật báo cáo tiến độ định kỳ lên Ban lãnh đạo.",
      requirements: [
        "Tốt nghiệp Đại học các ngành: Quản trị kinh doanh, Tài chính, Kinh tế đầu tư, Bất động sản hoặc lĩnh vực liên quan",
        "Độ tuổi: từ 25 tuổi",
        "Kinh nghiệm làm việc trong lĩnh vực đầu tư, phát triển dự án hoặc bất động sản từ 3 năm trở lên",
        "Có kỹ năng lập kế hoạch, phân tích tài chính và đánh giá hiệu quả dự án",
        "Thành thạo Word, Excel, PowerPoint; ưu tiên biết sử dụng phần mềm quản lý dự án",
      ],
      benefits: [
        "Thưởng theo tiến độ và hiệu quả dự án",
        "Tham gia các chương trình đào tạo nâng cao chuyên môn",
        "Đóng BHXH, BHYT, BHTN đầy đủ theo quy định pháp luật",
        "Du lịch nghỉ mát hằng năm, teambuilding và các hoạt động gắn kết đội ngũ",
      ],
    },
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Phân tích đầu tư",
      title: "Chuyên Viên Nghiên Cứu & Phân Tích Dự Án",
      salary: "15 - 20 triệu",
      experience: "2-4 năm",
      description:
        "Thu thập, phân tích dữ liệu thị trường và đánh giá tiềm năng các dự án đầu tư. Lập báo cáo nghiên cứu thị trường, báo cáo phân tích chi tiết. Đề xuất giải pháp đầu tư khả thi dựa trên dữ liệu và tình hình thực tế.",
      requirements: [
        "Tốt nghiệp ngành Tài chính, Kinh tế, Đầu tư",
        "Thành thạo phân tích tài chính, lập mô hình tài chính cơ bản",
        "Sử dụng tốt Excel, PowerPoint, ưu tiên có kinh nghiệm trong lĩnh vực bất động sản",
      ],
      benefits: [
        "Thưởng hiệu quả theo dự án",
        "Cơ hội thăng tiến nhanh",
        "Đào tạo nâng cao kỹ năng chuyên môn",
      ],
    },
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Quản lý dự án đầu tư",
      title: "Trưởng Nhóm Phát Triển Dự Án",
      salary: "Thoả thuận (theo năng lực)",
      experience: "5+ năm",
      description:
        "Chịu trách nhiệm chính trong việc điều phối toàn bộ quy trình triển khai dự án từ giai đoạn ý tưởng đến thi công. Làm việc với chính quyền, đối tác, nhà đầu tư và khách hàng để đảm bảo dự án triển khai đúng tiến độ và hiệu quả tài chính.",
      requirements: [
        "Tốt nghiệp ngành Kinh tế xây dựng, Bất động sản, Luật hoặc Tài chính",
        "Kinh nghiệm quản lý đội nhóm, hiểu rõ quy trình pháp lý đầu tư",
        "Kỹ năng đàm phán, lãnh đạo, tư duy chiến lược",
      ],
      benefits: [
        "Lương thưởng hấp dẫn, tùy theo năng lực",
        "Tham gia phát triển các dự án lớn, chiến lược",
        "Môi trường làm việc chuyên nghiệp, năng động",
      ],
    },
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Tài chính đầu tư",
      title: "Chuyên Viên Tài Chính Dự Án",
      salary: "18 - 25 triệu",
      experience: "3-5 năm",
      description:
        "Thực hiện phân tích hiệu quả tài chính các dự án, xây dựng kế hoạch dòng tiền, tham gia xây dựng hồ sơ vay vốn nếu cần. Phối hợp với bộ phận kế toán, pháp lý, phát triển dự án để lập báo cáo tài chính tổng thể.",
      requirements: [
        "Tốt nghiệp đại học chuyên ngành Tài chính, Kế toán, Kinh tế",
        "Kinh nghiệm lập mô hình tài chính, hiểu biết về dòng tiền và phân tích rủi ro",
        "Ưu tiên có kinh nghiệm làm việc trong công ty đầu tư bất động sản",
      ],
      benefits: [
        "Thưởng dự án hấp dẫn",
        "Được đào tạo thêm về đầu tư tài chính",
        "Cơ hội phát triển thành Trưởng nhóm tài chính",
      ],
    },
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Pháp lý đầu tư",
      title: "Chuyên Viên Pháp Lý Dự Án",
      salary: "15 - 18 triệu",
      experience: "2-3 năm",
      description:
        "Thực hiện công tác pháp lý liên quan đến dự án: xin chủ trương đầu tư, giấy phép xây dựng, giấy chứng nhận quyền sử dụng đất,... Làm việc với cơ quan chức năng để đảm bảo dự án thực hiện đúng quy định.",
      requirements: [
        "Tốt nghiệp đại học Luật hoặc các chuyên ngành liên quan",
        "Hiểu biết rõ về luật đầu tư, luật đất đai, xây dựng",
        "Kỹ năng làm việc với cơ quan nhà nước, kỹ năng giao tiếp tốt",
      ],
      benefits: [
        "Làm việc trong môi trường chuyên nghiệp",
        "Có cơ hội tiếp xúc các dự án lớn",
        "Thưởng theo tiến độ pháp lý",
      ],
    },
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Kinh doanh bất động sản",
      title: "Chuyên Viên Kinh Doanh Dự Án BĐS",
      salary: "Lương cứng + % hoa hồng",
      experience: "1-2 năm",
      description:
        "Tìm kiếm khách hàng, tư vấn bán sản phẩm bất động sản của công ty. Hỗ trợ làm thủ tục giao dịch, chăm sóc khách hàng sau bán. Đảm bảo đạt chỉ tiêu doanh số được giao theo tháng/quý.",
      requirements: [
        "Tốt nghiệp trung cấp trở lên, ưu tiên ngành Kinh doanh, Bất động sản",
        "Có kỹ năng giao tiếp và thuyết phục tốt",
        "Chịu được áp lực doanh số, năng động, trung thực",
      ],
      benefits: [
        "Hoa hồng cạnh tranh, thưởng nóng theo hiệu quả",
        "Đào tạo kỹ năng bán hàng chuyên sâu",
        "Môi trường làm việc năng động, hỗ trợ mạnh từ công ty",
      ],
    },
    {
      company: "CÔNG TY ĐẦU TƯ VÀ PHÁT TRIỂN ACB",
      companyId: "970789",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/9E8840D7-A36B-40DB-8B1D-744F9E249874.png",
      companyAddress:
        "Lô 34 B1.13 Ngô Huy Diễn, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng, Việt Nam",
      workplace: "Lô 34 B1.13 Ngô Huy Diễn, P. Hòa Xuân, Q. Cẩm Lệ, Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-05-01T08:00:00Z",
      industry: "Đầu tư và phát triển",
      specialization: "Hành chính nhân sự",
      title: "Nhân Viên Hành Chính - Nhân Sự",
      salary: "8 - 12 triệu",
      experience: "1-2 năm",
      description:
        "Thực hiện công tác tuyển dụng, theo dõi chấm công, tính lương, quản lý hồ sơ nhân sự. Soạn thảo văn bản, hợp đồng lao động. Hỗ trợ các hoạt động hành chính – văn phòng.",
      requirements: [
        "Tốt nghiệp Cao đẳng/Đại học ngành Quản trị nhân sự, Hành chính, Luật,...",
        "Có kỹ năng tổ chức công việc, giao tiếp tốt",
        "Sử dụng tốt Word, Excel, phần mềm chấm công",
      ],
      benefits: [
        "Được tham gia BHXH, BHYT đầy đủ",
        "Thưởng Lễ Tết, du lịch công ty",
        "Môi trường làm việc ổn định, lâu dài",
      ],
    },
    {
      company: "CÔNG TY HUNONIC",
      companyId: "880123",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/8FDF4CB3-4AAB-4CCA-BA1F-DF7EA2872118.jpg",
      companyAddress: "Số 9 Nguyễn Xiển, Thanh Xuân, Hà Nội, Việt Nam",
      workplace: "Văn phòng chính, Thanh Xuân, Hà Nội",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ - Nhà thông minh",
      specialization: "Phần mềm nhúng",
      title: "Kỹ Sư Phần Mềm Nhúng (Firmware Engineer)",
      salary: "15 - 25 triệu",
      experience: "2-3 năm",
      description:
        "Phát triển và tối ưu firmware cho các sản phẩm smart home: công tắc thông minh, cảm biến, gateway,... Làm việc với vi điều khiển, giao tiếp BLE, Zigbee, WiFi. Kết hợp với đội phần cứng và phần mềm để hoàn thiện sản phẩm.",
      requirements: [
        "Tốt nghiệp ngành Kỹ thuật điện tử, CNTT hoặc liên quan",
        "Thành thạo C/C++, có kinh nghiệm làm việc với vi điều khiển (STM32, ESP32...)",
        "Hiểu về giao thức truyền thông Zigbee/Bluetooth/WiFi là lợi thế",
      ],
      benefits: [
        "Môi trường nghiên cứu công nghệ thực tế, sản phẩm ứng dụng cao",
        "Thưởng theo sản phẩm, dự án",
        "Tham gia BHXH, nghỉ lễ Tết theo quy định",
      ],
    },
    {
      company: "CÔNG TY HUNONIC",
      companyId: "880123",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/8FDF4CB3-4AAB-4CCA-BA1F-DF7EA2872118.jpg",
      companyAddress: "Số 9 Nguyễn Xiển, Thanh Xuân, Hà Nội, Việt Nam",
      workplace: "Văn phòng chính, Thanh Xuân, Hà Nội",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ - Nhà thông minh",
      specialization: "Thiết kế giao diện người dùng",
      title: "UI/UX Designer – Ứng Dụng Smart Home",
      salary: "12 - 18 triệu",
      experience: "1-2 năm",
      description:
        "Thiết kế giao diện người dùng và trải nghiệm người dùng cho ứng dụng mobile quản lý nhà thông minh. Kết hợp với lập trình viên và đội marketing để đảm bảo trải nghiệm tốt cho khách hàng.",
      requirements: [
        "Tốt nghiệp Thiết kế đồ họa, Mỹ thuật, hoặc các ngành liên quan",
        "Thành thạo Figma, Adobe XD, hiểu biết nguyên tắc UX, wireframe",
        "Có tư duy thẩm mỹ, sáng tạo, yêu thích công nghệ",
      ],
      benefits: [
        "Môi trường sáng tạo, chuyên nghiệp",
        "Tham gia trực tiếp vào quá trình phát triển ứng dụng thực tế",
        "Cơ hội học hỏi và thăng tiến rõ ràng",
      ],
    },
    {
      company: "CÔNG TY HUNONIC",
      companyId: "880123",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/8FDF4CB3-4AAB-4CCA-BA1F-DF7EA2872118.jpg",
      companyAddress: "Số 9 Nguyễn Xiển, Thanh Xuân, Hà Nội, Việt Nam",
      workplace: "Khu vực Hà Nội và các tỉnh lân cận",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ - Nhà thông minh",
      specialization: "Lắp đặt thiết bị",
      title: "Nhân Viên Kỹ Thuật Lắp Đặt Thiết Bị Smart Home",
      salary: "10 - 14 triệu",
      experience: "Không yêu cầu/Ưu tiên có kinh nghiệm",
      description:
        "Thực hiện lắp đặt, cài đặt và hướng dẫn sử dụng các thiết bị smart home cho khách hàng. Hỗ trợ kỹ thuật từ xa, xử lý các lỗi đơn giản tại nhà khách hàng.",
      requirements: [
        "Tốt nghiệp trung cấp, cao đẳng kỹ thuật hoặc điện – điện tử",
        "Trung thực, chăm chỉ, có tinh thần học hỏi",
        "Ưu tiên ứng viên đã từng làm kỹ thuật viên lắp đặt",
      ],
      benefits: [
        "Đào tạo miễn phí, có lương thử việc",
        "Phụ cấp xăng xe, điện thoại",
        "Có cơ hội thăng tiến làm trưởng nhóm kỹ thuật",
      ],
    },
    {
      company: "CÔNG TY HUNONIC",
      companyId: "880123",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/8FDF4CB3-4AAB-4CCA-BA1F-DF7EA2872118.jpg",
      companyAddress: "Số 9 Nguyễn Xiển, Thanh Xuân, Hà Nội, Việt Nam",
      workplace: "Hà Nội hoặc khu vực được phân công",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ - Nhà thông minh",
      specialization: "Kinh doanh thiết bị công nghệ",
      title: "Nhân Viên Kinh Doanh Thiết Bị Smart Home",
      salary: "Lương cứng + hoa hồng cao",
      experience: "Không yêu cầu/Kinh nghiệm là lợi thế",
      description:
        "Tư vấn, giới thiệu và bán các thiết bị nhà thông minh Hunonic đến khách hàng cá nhân và đại lý. Chăm sóc khách hàng cũ và phát triển khách hàng mới.",
      requirements: [
        "Đam mê kinh doanh, có khả năng giao tiếp tốt",
        "Có kiến thức cơ bản về công nghệ, điện tử là một lợi thế",
        "Chịu khó, có định hướng gắn bó lâu dài",
      ],
      benefits: [
        "Thu nhập hấp dẫn theo hiệu suất",
        "Đào tạo kiến thức sản phẩm, kỹ năng tư vấn",
        "Làm việc trong môi trường công nghệ năng động",
      ],
    },
    {
      company: "CÔNG TY HUNONIC",
      companyId: "880123",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/8FDF4CB3-4AAB-4CCA-BA1F-DF7EA2872118.jpg",
      companyAddress: "Số 9 Nguyễn Xiển, Thanh Xuân, Hà Nội, Việt Nam",
      workplace: "Văn phòng chính, Thanh Xuân, Hà Nội",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ - Nhà thông minh",
      specialization: "Kiểm thử phần mềm",
      title: "Chuyên Viên Kiểm Thử Ứng Dụng (Mobile App Tester)",
      salary: "10 - 16 triệu",
      experience: "1 năm trở lên",
      description:
        "Thực hiện kiểm thử chức năng và giao diện ứng dụng mobile Hunonic (iOS/Android). Viết test case, log bug và phối hợp đội phát triển để khắc phục lỗi.",
      requirements: [
        "Hiểu biết về kiểm thử phần mềm, biết viết test case",
        "Cẩn thận, tỉ mỉ, có tư duy logic tốt",
        "Ưu tiên ứng viên từng kiểm thử ứng dụng IoT hoặc Smart Home",
      ],
      benefits: [
        "Làm việc với sản phẩm thực tế, nhiều người dùng",
        "Đào tạo nâng cao kỹ năng QA/QC",
        "Môi trường startup công nghệ năng động",
      ],
    },
    {
      company: "CÔNG TY HUNONIC",
      companyId: "880123",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/8FDF4CB3-4AAB-4CCA-BA1F-DF7EA2872118.jpg",
      companyAddress: "Số 9 Nguyễn Xiển, Thanh Xuân, Hà Nội, Việt Nam",
      workplace: "Xưởng sản xuất Hunonic, Hà Nội",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ - Nhà thông minh",
      specialization: "Quản lý sản xuất",
      title: "Trưởng Nhóm Sản Xuất Thiết Bị (Smart Home)",
      salary: "12 - 18 triệu",
      experience: "Tối thiểu 2 năm ở vị trí tương đương",
      description:
        "Phụ trách quản lý tổ sản xuất thiết bị điện tử Hunonic: công tắc, cảm biến,... Đảm bảo tiến độ, chất lượng sản xuất, phối hợp kỹ thuật, kho và QC để hoàn thiện sản phẩm đúng yêu cầu.",
      requirements: [
        "Tốt nghiệp ngành kỹ thuật điện, điện tử, tự động hóa,...",
        "Có kinh nghiệm quản lý nhóm sản xuất",
        "Kỹ năng điều phối nhân lực, xử lý vấn đề nhanh",
      ],
      benefits: [
        "Thưởng hiệu suất, hỗ trợ ăn trưa, xăng xe",
        "Có cơ hội phát triển lên quản lý cấp cao",
        "Môi trường sản xuất theo tiêu chuẩn hiện đại",
      ],
    },
    {
      company: "CÔNG TY CỔ PHẦN MÔI TRƯỜNG XANH VIỆT NAM",
      companyId: "990001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/FD6DCD83-A855-41F8-909C-411B591181DE.jpg",
      companyAddress: "Số 45 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      workplace: "TP. Hồ Chí Minh",
      location: "TP. Hồ Chí Minh",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Môi trường",
      specialization: "Quản lý chất thải",
      title: "Kỹ Sư Môi Trường – Quản Lý Chất Thải",
      salary: "12 - 18 triệu",
      experience: "2-4 năm",
      description:
        "Quản lý, giám sát và thực hiện các hoạt động xử lý chất thải công nghiệp, đảm bảo tuân thủ các quy định về bảo vệ môi trường.",
      requirements: [
        "Tốt nghiệp ngành Môi trường, Kỹ thuật tài nguyên môi trường hoặc tương đương",
        "Có kinh nghiệm quản lý chất thải và xử lý môi trường",
        "Am hiểu các quy định pháp luật về môi trường",
      ],
      benefits: [
        "Đóng BHXH, BHYT đầy đủ",
        "Đào tạo nâng cao kỹ năng chuyên môn",
        "Môi trường làm việc chuyên nghiệp, năng động",
      ],
    },
    {
      company: "CÔNG TY CỔ PHẦN MÔI TRƯỜNG XANH VIỆT NAM",
      companyId: "990001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/FD6DCD83-A855-41F8-909C-411B591181DE.jpg",
      companyAddress: "Số 45 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      workplace: "TP. Hồ Chí Minh",
      location: "TP. Hồ Chí Minh",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Môi trường",
      specialization: "Tư vấn môi trường",
      title: "Chuyên Viên Tư Vấn Đánh Giá Tác Động Môi Trường (ĐTM)",
      salary: "10 - 15 triệu",
      experience: "1 năm trở lên",
      description:
        "Lập báo cáo đánh giá tác động môi trường, hồ sơ cấp phép môi trường cho các dự án đầu tư, hỗ trợ thủ tục pháp lý liên quan.",
      requirements: [
        "Tốt nghiệp chuyên ngành Môi trường hoặc liên quan",
        "Kinh nghiệm làm hồ sơ ĐTM, giấy phép môi trường",
        "Kỹ năng giao tiếp, làm việc với cơ quan chức năng",
      ],
      benefits: [
        "Môi trường làm việc thân thiện, chuyên nghiệp",
        "Chế độ BHXH, BHYT đầy đủ",
        "Cơ hội đào tạo, phát triển nghề nghiệp",
      ],
    },
    {
      company: "CÔNG TY CỔ PHẦN MÔI TRƯỜNG XANH VIỆT NAM",
      companyId: "990001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/FD6DCD83-A855-41F8-909C-411B591181DE.jpg",
      companyAddress: "Số 45 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      workplace: "TP. Hồ Chí Minh",
      location: "TP. Hồ Chí Minh",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Môi trường",
      specialization: "Giám sát môi trường",
      title: "Nhân Viên Giám Sát Và Đo Đạc Môi Trường",
      salary: "9 - 13 triệu",
      experience: "1-2 năm",
      description:
        "Thực hiện các công tác lấy mẫu, đo đạc, quan trắc môi trường (khí thải, nước thải, tiếng ồn) tại các công trình, báo cáo kết quả cho bộ phận kỹ thuật và khách hàng.",
      requirements: [
        "Tốt nghiệp Trung cấp/Đại học ngành Môi trường hoặc tương đương",
        "Có kỹ năng lấy mẫu và đo đạc thiết bị môi trường",
        "Cẩn thận, tuân thủ quy trình an toàn lao động",
      ],
      benefits: [
        "Chế độ BHXH, BHYT đầy đủ",
        "Hỗ trợ công tác, trang thiết bị hiện đại",
        "Môi trường làm việc chuyên nghiệp",
      ],
    },
    {
      company: "CÔNG TY TNHH HIGH TECH",
      companyId: "991001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/0E0DC9C9-EF26-46F1-A693-4287F1276414.jpg",
      companyAddress: "Số 123 Đường Lê Văn Lương, Hà Nội",
      workplace: "Hà Nội",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ thông tin",
      specialization: "Phát triển phần mềm",
      title: "Kỹ Sư Phát Triển Phần Mềm",
      salary: "15 - 25 triệu",
      experience: "2-4 năm",
      description:
        "Phát triển, bảo trì các ứng dụng phần mềm theo yêu cầu khách hàng, phối hợp với team để tối ưu hiệu suất và trải nghiệm người dùng.",
      requirements: [
        "Tốt nghiệp ngành Công nghệ thông tin hoặc tương đương",
        "Thành thạo ngôn ngữ lập trình Java, JavaScript hoặc Python",
        "Kinh nghiệm làm việc với hệ thống backend và frontend",
      ],
      benefits: [
        "Chế độ BHXH, BHYT, BHTN đầy đủ",
        "Cơ hội học hỏi, thăng tiến",
        "Môi trường làm việc năng động, sáng tạo",
      ],
    },
    {
      company: "CÔNG TY TNHH HIGH TECH",
      companyId: "991001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/0E0DC9C9-EF26-46F1-A693-4287F1276414.jpg",
      companyAddress: "Số 123 Đường Lê Văn Lương, Hà Nội",
      workplace: "Hà Nội",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Công nghệ thông tin",
      specialization: "Hỗ trợ kỹ thuật",
      title: "Chuyên Viên Hỗ Trợ Kỹ Thuật",
      salary: "10 - 15 triệu",
      experience: "1-2 năm",
      description:
        "Hỗ trợ khách hàng trong việc cài đặt, vận hành và xử lý sự cố phần mềm, phần cứng theo yêu cầu.",
      requirements: [
        "Có kiến thức cơ bản về phần cứng và phần mềm máy tính",
        "Kỹ năng giao tiếp tốt, xử lý tình huống nhanh",
        "Ưu tiên ứng viên có kinh nghiệm hỗ trợ kỹ thuật",
      ],
      benefits: [
        "Chế độ bảo hiểm đầy đủ",
        "Môi trường làm việc thân thiện",
        "Cơ hội đào tạo và phát triển kỹ năng",
      ],
    },
    {
      company: "CÔNG TY CỔ PHẦN VINATECH",
      companyId: "992001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/934FC91D-4F69-4041-B640-6D9B0AF2923A.png",
      companyAddress: "Số 56 Đường Trần Phú, TP. Hồ Chí Minh",
      workplace: "TP. Hồ Chí Minh",
      location: "TP. Hồ Chí Minh",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Điện tử - Viễn thông",
      specialization: "Kỹ sư điện tử",
      title: "Kỹ Sư Điện Tử - Viễn Thông",
      salary: "14 - 22 triệu",
      experience: "3-5 năm",
      description:
        "Thiết kế, phát triển và bảo trì các thiết bị điện tử, hệ thống viễn thông, đảm bảo hiệu quả và ổn định trong hoạt động.",
      requirements: [
        "Tốt nghiệp ngành Điện tử Viễn thông hoặc tương đương",
        "Có kinh nghiệm thiết kế mạch điện tử, lập trình vi xử lý",
        "Khả năng phân tích, xử lý sự cố kỹ thuật",
      ],
      benefits: [
        "Bảo hiểm theo quy định",
        "Chế độ nghỉ phép, thưởng hấp dẫn",
        "Môi trường làm việc chuyên nghiệp",
      ],
    },
    {
      company: "CÔNG TY CỔ PHẦN VINATECH",
      companyId: "992001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/934FC91D-4F69-4041-B640-6D9B0AF2923A.png",
      companyAddress: "Số 56 Đường Trần Phú, TP. Hồ Chí Minh",
      workplace: "TP. Hồ Chí Minh",
      location: "TP. Hồ Chí Minh",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Điện tử - Viễn thông",
      specialization: "Hỗ trợ kỹ thuật",
      title: "Chuyên Viên Kỹ Thuật Hỗ Trợ Khách Hàng",
      salary: "10 - 14 triệu",
      experience: "1-3 năm",
      description:
        "Hỗ trợ khách hàng về kỹ thuật sử dụng sản phẩm, hướng dẫn bảo trì, xử lý sự cố và bảo hành thiết bị điện tử, viễn thông.",
      requirements: [
        "Hiểu biết về sản phẩm điện tử viễn thông",
        "Kỹ năng giao tiếp và xử lý tình huống tốt",
        "Kinh nghiệm chăm sóc khách hàng là lợi thế",
      ],
      benefits: [
        "Chế độ BHXH, BHYT đầy đủ",
        "Đào tạo nâng cao kỹ năng",
        "Môi trường làm việc thân thiện",
      ],
    },
    {
      company: "CÔNG TY TNHH DỊCH VỤ Ô TÔ TOÀN PHÁT",
      companyId: "771001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/59C23E46-D88F-4676-B9E6-5B79C9DDF245.jpg",
      companyAddress: "Số 200 Quốc lộ 13, P. Hiệp Bình Chánh, TP. Thủ Đức",
      workplace: "TP. Thủ Đức, TP. HCM",
      location: "TP. HCM",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Ô tô - Xe máy",
      specialization: "Sửa chữa ô tô",
      title: "Kỹ Thuật Viên Sửa Chữa Ô Tô (Máy Gầm)",
      salary: "10 - 15 triệu",
      experience: "1-3 năm",
      description:
        "Thực hiện kiểm tra, bảo dưỡng, sửa chữa hệ thống động cơ, gầm xe ô tô các loại. Đảm bảo xe sau sửa chữa đạt chất lượng kỹ thuật và an toàn.",
      requirements: [
        "Tốt nghiệp Trung cấp/Cao đẳng chuyên ngành Ô tô hoặc Cơ khí",
        "Có kinh nghiệm thực tế sửa chữa máy gầm xe ô tô",
        "Trung thực, cẩn thận, tinh thần trách nhiệm cao",
      ],
      benefits: [
        "Được đào tạo nâng cao tay nghề",
        "BHXH, thưởng hiệu suất theo tháng",
        "Cơ hội thăng tiến lên tổ trưởng kỹ thuật",
      ],
    },
    {
      company: "CÔNG TY TNHH DỊCH VỤ Ô TÔ TOÀN PHÁT",
      companyId: "771001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/59C23E46-D88F-4676-B9E6-5B79C9DDF245.jpg",
      companyAddress: "Số 200 Quốc lộ 13, P. Hiệp Bình Chánh, TP. Thủ Đức",
      workplace: "TP. Thủ Đức, TP. HCM",
      location: "TP. HCM",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Ô tô - Xe máy",
      specialization: "Đồng sơn ô tô",
      title: "Nhân Viên Gò Hàn - Đồng Sơn Ô Tô",
      salary: "12 - 18 triệu",
      experience: "2 năm trở lên",
      description:
        "Thực hiện gò hàn, xử lý thân vỏ xe bị móp, va chạm và sơn lại toàn bộ hoặc cục bộ xe ô tô theo yêu cầu kỹ thuật và thẩm mỹ.",
      requirements: [
        "Kinh nghiệm gò hàn, đồng sơn thực tế từ 2 năm",
        "Tay nghề vững, tỉ mỉ, có trách nhiệm trong công việc",
        "Ưu tiên có kinh nghiệm làm tại gara hoặc hãng xe",
      ],
      benefits: [
        "Thu nhập ổn định theo năng lực",
        "Làm việc trong môi trường chuyên nghiệp",
        "Có hỗ trợ ăn trưa và nhà trọ nếu ở xa",
      ],
    },
    {
      company: "CÔNG TY TNHH DỊCH VỤ Ô TÔ TOÀN PHÁT",
      companyId: "771001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/59C23E46-D88F-4676-B9E6-5B79C9DDF245.jpg",
      companyAddress: "Số 200 Quốc lộ 13, P. Hiệp Bình Chánh, TP. Thủ Đức",
      workplace: "TP. Thủ Đức, TP. HCM",
      location: "TP. HCM",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Ô tô - Xe máy",
      specialization: "Điện ô tô",
      title: "Chuyên Viên Chẩn Đoán Ô Tô (Điện – ECU)",
      salary: "15 - 20 triệu",
      experience: "2-4 năm",
      description:
        "Chẩn đoán, phân tích và xử lý các lỗi điện, hệ thống điều khiển điện tử (ECU) của ô tô bằng thiết bị chuyên dụng. Phối hợp với kỹ thuật viên sửa chữa.",
      requirements: [
        "Am hiểu sâu về hệ thống điện, ECU, cảm biến",
        "Sử dụng thành thạo máy chẩn đoán lỗi ô tô",
        "Có kinh nghiệm thực tế với các dòng xe Nhật, Hàn, châu Âu",
      ],
      benefits: [
        "Lương + Thưởng theo tay nghề",
        "Chế độ BHXH đầy đủ",
        "Cơ hội được đào tạo tại hãng",
      ],
    },
    {
      company: "CÔNG TY CỔ PHẦN CƠ KHÍ THÁI NGUYÊN",
      companyId: "661001",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/890D05A0-4D5C-460B-92C4-3B0FCFC48AA7.jpg",
      companyAddress: "KCN Sông Công I, TP. Sông Công, Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Cơ khí - Sản xuất",
      specialization: "Kỹ thuật cơ khí",
      title: "Kỹ Sư Sản Xuất – Nhà Máy Cơ Khí",
      salary: "12 - 18 triệu",
      experience: "2-4 năm",
      description:
        "Thực hiện kế hoạch sản xuất, theo dõi tiến độ, giám sát chất lượng sản phẩm cơ khí, phối hợp với bộ phận QA/QC.",
      requirements: [
        "Tốt nghiệp Đại học chuyên ngành Cơ khí, Cơ điện tử",
        "Hiểu biết về bản vẽ kỹ thuật, lập kế hoạch sản xuất",
        "Ưu tiên có kinh nghiệm làm trong nhà máy cơ khí",
      ],
      benefits: [
        "Làm việc tại nhà máy hiện đại, an toàn",
        "BHXH, thưởng lễ tết, phụ cấp chuyên cần",
        "Hỗ trợ nhà ở cho kỹ sư ở xa",
      ],
    },
    {
      company: "CÔNG TY TNHH ĐIỆN TỬ TECHVINA",
      companyId: "221002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/6201F856-A15D-43AB-85A1-F6F8EE924458.png",
      companyAddress: "KCN Yên Bình, Phổ Yên, Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Điện tử",
      specialization: "Kiểm tra chất lượng",
      title: "Nhân Viên KCS – Kiểm Tra Chất Lượng",
      salary: "8 - 10 triệu",
      experience: "Không yêu cầu / Dưới 1 năm",
      description:
        "Kiểm tra ngoại quan và chất lượng linh kiện điện tử theo tiêu chuẩn. Báo cáo lỗi sản xuất và đề xuất hướng xử lý.",
      requirements: [
        "Tốt nghiệp Trung cấp trở lên",
        "Cẩn thận, tỉ mỉ, có trách nhiệm trong công việc",
        "Ưu tiên có kinh nghiệm KCS trong lĩnh vực điện tử",
      ],
      benefits: [
        "Làm việc theo ca, hỗ trợ ăn trưa",
        "BHXH, thưởng năng suất",
        "Cơ hội lên tổ trưởng sau 6 tháng",
      ],
    },
    {
      company: "CÔNG TY TNHH ĐIỆN TỬ TECHVINA",
      companyId: "221002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/6201F856-A15D-43AB-85A1-F6F8EE924458.png",
      companyAddress: "KCN Yên Bình, Phổ Yên, Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Điện tử",
      specialization: "Bảo trì – sửa chữa",
      title: "Kỹ Sư Bảo Trì Máy Móc – Nhà Máy Điện Tử",
      salary: "12 – 17 triệu",
      experience: "2 – 3 năm",
      description:
        "Chịu trách nhiệm kiểm tra, bảo dưỡng, sửa chữa các thiết bị sản xuất trong dây chuyền SMT, kiểm tra lỗi và xử lý sự cố nhanh chóng để đảm bảo tiến độ sản xuất.",
      requirements: [
        "Tốt nghiệp cao đẳng, đại học chuyên ngành Điện – Điện tử, Cơ điện tử",
        "Hiểu biết về PLC, tự động hóa là lợi thế",
        "Làm việc theo ca, chịu áp lực tốt",
      ],
      benefits: [
        "Lương ổn định + phụ cấp ca đêm + thưởng hiệu suất",
        "Được đào tạo chuyên sâu về thiết bị SMT, máy in board, AOI...",
        "Tham gia BHXH, du lịch, khám sức khỏe định kỳ",
      ],
    },
    {
      company: "CÔNG TY TNHH ĐIỆN TỬ TECHVINA",
      companyId: "221002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/6201F856-A15D-43AB-85A1-F6F8EE924458.png",
      companyAddress: "KCN Yên Bình, Phổ Yên, Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Điện tử",
      specialization: "Sản xuất – Quản lý",
      title: "Quản Lý Dây Chuyền SMT",
      salary: "15 – 20 triệu",
      experience: "3 – 5 năm",
      description:
        "Điều hành toàn bộ hoạt động sản xuất của dây chuyền SMT, phân công nhân lực, đảm bảo tiến độ và chất lượng sản phẩm. Hỗ trợ kỹ thuật và kiểm tra dữ liệu sản xuất.",
      requirements: [
        "Có kinh nghiệm 3 năm trở lên trong quản lý dây chuyền SMT",
        "Kỹ năng lãnh đạo, xử lý tình huống và làm việc nhóm tốt",
        "Ưu tiên từng làm việc tại công ty sản xuất điện tử Hàn/Nhật",
      ],
      benefits: [
        "Chế độ lương + KPI + phụ cấp trách nhiệm hấp dẫn",
        "Thăng tiến rõ ràng lên Trưởng bộ phận/Quản lý sản xuất",
        "Được tham gia các khóa đào tạo chuyên sâu tại nước ngoài",
      ],
    },
    {
      company: "CÔNG TY TNHH ĐIỆN TỬ TECHVINA",
      companyId: "221002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/6201F856-A15D-43AB-85A1-F6F8EE924458.png",
      companyAddress: "KCN Yên Bình, Phổ Yên, Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Điện tử",
      specialization: "QA/QC",
      title: "Nhân Viên QA – Kiểm Soát Chất Lượng Nhà Cung Ứng",
      salary: "9 – 12 triệu",
      experience: "1 – 2 năm",
      description:
        "Đánh giá và kiểm soát chất lượng nguyên vật liệu đầu vào từ nhà cung ứng. Làm việc trực tiếp với bộ phận thu mua và sản xuất để đảm bảo tiêu chuẩn đầu vào.",
      requirements: [
        "Tốt nghiệp cao đẳng trở lên ngành Kỹ thuật hoặc Quản lý chất lượng",
        "Có hiểu biết về tiêu chuẩn ISO, kiểm tra mẫu, thống kê dữ liệu chất lượng",
        "Ưu tiên có kinh nghiệm làm việc trong lĩnh vực điện tử",
      ],
      benefits: [
        "Môi trường làm việc chuyên nghiệp, ổn định",
        "Thưởng quý, thưởng năm theo đánh giá chất lượng công việc",
        "Được tham gia các chương trình cải tiến 5S – Kaizen",
      ],
    },
    {
      company: "CHI NHÁNH VIETTEL THÁI NGUYÊN",
      companyId: "331002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/F6F8643D-1DD9-4B42-B9BD-36C41C91166B.png",
      companyAddress: "Số 5 Phủ Liễn, TP. Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Viễn thông",
      specialization: "Kỹ thuật mạng",
      title: "Nhân Viên Kỹ Thuật Viễn Thông",
      salary: "10 - 14 triệu",
      experience: "1-3 năm",
      description:
        "Triển khai và bảo trì hệ thống viễn thông, internet, cáp quang. Hỗ trợ khách hàng xử lý sự cố kết nối tại nhà.",
      requirements: [
        "Tốt nghiệp Trung cấp/Cao đẳng kỹ thuật viễn thông, CNTT",
        "Biết hàn cáp quang, cấu hình modem/router",
        "Có xe máy đi lại và tinh thần trách nhiệm",
      ],
      benefits: [
        "Lương + doanh số, phụ cấp xăng xe",
        "BHXH, thưởng lễ tết đầy đủ",
        "Hỗ trợ đào tạo nghiệp vụ",
      ],
    },
    {
      company: "CHI NHÁNH VIETTEL THÁI NGUYÊN",
      companyId: "331002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/F6F8643D-1DD9-4B42-B9BD-36C41C91166B.png",
      companyAddress: "Số 5 Phủ Liễn, TP. Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Viễn thông",
      specialization: "Kỹ thuật mạng",
      title: "Nhân Viên Kỹ Thuật Viễn Thông (Triển khai & Bảo trì)",
      salary: "10 – 14 triệu",
      experience: "1 – 3 năm",
      description:
        "Triển khai và bảo trì hệ thống internet, truyền hình, cáp quang tại khu vực phụ trách. Xử lý sự cố kỹ thuật tại nhà khách hàng.",
      requirements: [
        "Tốt nghiệp Trung cấp trở lên ngành Viễn thông, CNTT, Điện tử",
        "Có kỹ năng hàn cáp quang, cấu hình thiết bị mạng cơ bản",
        "Có phương tiện đi lại, sức khỏe tốt",
      ],
      benefits: [
        "Thu nhập ổn định, thưởng năng suất hàng tháng",
        "Được đào tạo, nâng cao chuyên môn kỹ thuật",
        "Đóng đầy đủ BHXH, BHYT, BHTN",
      ],
    },
    {
      company: "CHI NHÁNH VIETTEL THÁI NGUYÊN",
      companyId: "331002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/F6F8643D-1DD9-4B42-B9BD-36C41C91166B.png",
      companyAddress: "Số 5 Phủ Liễn, TP. Thái Nguyên",
      workplace: "Thái Nguyên",
      location: "Thái Nguyên",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Viễn thông",
      specialization: "Kinh doanh – bán hàng",
      title: "Nhân Viên Kinh Doanh Dịch Vụ Viettel",
      salary: "8 – 12 triệu + hoa hồng",
      experience: "Không yêu cầu / Ưu tiên có kinh nghiệm",
      description:
        "Tư vấn, giới thiệu các gói cước, dịch vụ internet – truyền hình – di động của Viettel tới khách hàng cá nhân & doanh nghiệp tại địa phương.",
      requirements: [
        "Tốt nghiệp Trung cấp trở lên, yêu thích công việc kinh doanh",
        "Kỹ năng giao tiếp, thuyết phục tốt",
        "Ưu tiên có kinh nghiệm telesales hoặc thị trường",
      ],
      benefits: [
        "Hoa hồng cao, hỗ trợ data khách hàng",
        "Cơ hội trở thành trưởng nhóm kinh doanh sau 6 tháng",
        "Được đào tạo bài bản, môi trường chuyên nghiệp",
      ],
    },
    {
      company: "NGÂN HÀNG TMCP QUÂN ĐỘI (MB BANK)",
      companyId: "441002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/27476618-97E8-48A4-ACA5-C60DAE580883.png",
      companyAddress: "63 Lê Văn Lương, Thanh Xuân, Hà Nội",
      workplace: "Hà Nội / TP. HCM / Toàn quốc",
      location: "Hà Nội",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Ngân hàng – Tài chính",
      specialization: "Tư vấn tài chính cá nhân",
      title: "Chuyên Viên Tư Vấn Tài Chính Cá Nhân",
      salary: "10 – 18 triệu + hoa hồng",
      experience: "1 năm trở lên",
      description:
        "Tư vấn các sản phẩm tài chính cá nhân của MB như: tiết kiệm, vay tiêu dùng, thẻ tín dụng, bảo hiểm,... Hỗ trợ khách hàng mở tài khoản và sử dụng dịch vụ ngân hàng số.",
      requirements: [
        "Tốt nghiệp Cao đẳng/Đại học chuyên ngành tài chính, ngân hàng, kinh tế",
        "Kỹ năng giao tiếp và thuyết phục tốt",
        "Ưu tiên có kinh nghiệm tư vấn tài chính, bán hàng dịch vụ",
      ],
      benefits: [
        "Hoa hồng hấp dẫn không giới hạn",
        "Cơ hội thăng tiến rõ ràng tại MB Group",
        "Chế độ BHXH, nghỉ lễ, du lịch đầy đủ",
      ],
    },
    {
      company: "NGÂN HÀNG TMCP QUÂN ĐỘI (MB BANK)",
      companyId: "441002",
      logo: "file:///var/mobile/Containers/Data/Application/9C1B2A1A-56E2-48EC-ADC9-E4586066C84E/Library/Caches/ExponentExperienceData/@anonymous/lap10-c57eaeda-4003-40e1-aaed-6d0bea108d11/ImagePicker/27476618-97E8-48A4-ACA5-C60DAE580883.png",
      companyAddress: "63 Lê Văn Lương, Thanh Xuân, Hà Nội",
      workplace: "Hà Nội / TP. HCM / Hải Phòng / Đà Nẵng",
      location: "Đà Nẵng",
      createdAt: "2025-06-07T08:00:00Z",
      industry: "Ngân hàng – Tài chính",
      specialization: "Quan hệ khách hàng doanh nghiệp",
      title: "Chuyên Viên Quan Hệ Khách Hàng Doanh Nghiệp",
      salary: "18 – 25 triệu + thưởng",
      experience: "2 – 4 năm",
      description:
        "Tìm kiếm, phát triển và chăm sóc khách hàng doanh nghiệp sử dụng các dịch vụ tài chính: tín dụng, thanh toán quốc tế, bảo lãnh, tiền gửi doanh nghiệp,...",
      requirements: [
        "Tốt nghiệp Đại học trở lên ngành Tài chính, Ngân hàng, Kinh tế đối ngoại",
        "Có kinh nghiệm ở vị trí tương đương tại các ngân hàng lớn",
        "Am hiểu thị trường, có network doanh nghiệp là lợi thế",
      ],
      benefits: [
        "Thu nhập cạnh tranh, thưởng theo doanh số",
        "Được hỗ trợ khách hàng tiềm năng từ MB Group",
        "Chế độ nghỉ mát, đào tạo nâng cao năng lực định kỳ",
      ],
    },
  ];

  const addJobsToFirebase = async () => {
    setLoading(true);
    try {
      for (const job of sampleJobs) {
        await addDoc(collection(db, "jobs"), job);
      }
      Alert.alert("Thành công", "Đã thêm 30 công việc vào Firebase");
    } catch (error) {
      console.error("Error adding jobs: ", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm công việc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm 30 công việc mẫu vào Firebase</Text>
      <Text style={styles.note}>Nhấn nút bên dưới để thêm dữ liệu mẫu</Text>

      <View style={styles.experienceList}>
        <Text style={styles.subtitle}>Các mức kinh nghiệm:</Text>
        {experienceLevels.map((level, index) => (
          <Text key={index} style={styles.experienceItem}>
            - {level}
          </Text>
        ))}
      </View>

      <Button
        title={loading ? "Đang thêm..." : "Thêm công việc"}
        onPress={addJobsToFirebase}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  note: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  experienceList: {
    marginBottom: 30,
    alignSelf: "flex-start",
    paddingLeft: 20,
  },
  experienceItem: {
    marginBottom: 3,
  },
});

export default AddJobsScreen;
