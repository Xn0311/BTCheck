import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Button, 
  Alert, 
  TouchableOpacity, 
  Image,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';


const firestore = db;

type CVData = {
  fullName: string; // Họ tên
  position: string; // Vị trí
  gender: string; // Giới tính
  phone: string; // Số điện thoại
  email: string; // Email
  address: string; // Địa chỉ
  objective: string; // Mục tiêu nghề nghiệp
  education: {
    school: string;  // Trường học
    major: string;   // Ngành học
    period: string;  // Thời gian học
    achievement: string; // Thành tích học tập
  }[];  // Mảng các mục học vấn
  experience: {
    company: string;  // Công ty
    position: string; // Vị trí
    period: string;   // Thời gian làm việc
    description: string[]; // Mô tả công việc
  }[];  // Mảng các mục kinh nghiệm làm việc
  skills: string[]; // Kỹ năng
  activities: {
    organization: string;  // Tổ chức
    position: string;     // Vị trí trong tổ chức
    period: string;       // Thời gian tham gia
    description: string[]; // Mô tả hoạt động
  }[];  // Mảng các hoạt động tham gia
  hobbies: string[]; // Sở thích
  certificates: string[]; // Chứng chỉ
  avatar?: string;
  cvName?: string;

};



const PreviewCVScreen = ({ navigation }) => {
  const [cv, setCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  
  const cvRef = useRef<View>(null);
  const route = useRoute();
  const { cvId } = route.params; // Lấy cvId từ navigation


  useEffect(() => {
    
    const loadData = async () => {
    try {
        const docRef = doc(firestore, 'CV', cvId); // Lấy đúng CV theo ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        const data = docSnap.data();
        setCV({
            cvName: data.cvName || '',
            fullName: data.fullName || '',
            position: data.position || '',
            gender: data.gender || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            objective: data.objective || '',

            // Chuyển đổi education thành mảng đối tượng
            education: typeof data.education === 'string'
            ? [{
                school: data.education,
                major: '',
                period: '',
                achievement: ''
                }]
            : [],

            // Chuyển đổi experience thành mảng đối tượng
            experience: typeof data.experience === 'string'
            ? [{
                company: data.experience,
                position: '',
                period: '',
                description: ['']
                }]
            : [],

            // Chuyển đổi skills thành mảng chuỗi
            skills: typeof data.skills === 'string'
            ? data.skills.split(',').map(s => s.trim())
            : [],

            // Chuyển đổi activities thành mảng đối tượng
            activities: typeof data.activities === 'string'
            ? [{
                organization: data.activities,
                position: '',
                period: '',
                description: ['']
                }]
            : [],

            // Chuyển đổi hobbies thành mảng chuỗi
            hobbies: typeof data.hobby === 'string'
            ? data.hobby.split(',').map(hobby => hobby.trim())
            : [],

            // Chuyển đổi certificates thành mảng chuỗi
            certificates: typeof data.certificate === 'string'
            ? data.certificate.split(',').map(cert => cert.trim())
            : [],

            avatar: data.avatar || null
            
        });

        if (data.avatar) {
            setAvatar(data.avatar);
        }
        } else {
        console.warn('Không tìm thấy CV');
        }
    } catch (error) {
        console.error('Error loading CV:', error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu CV');
    } finally {
        setLoading(false);
    }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSaveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to media library');
        return;
      }

      const uri = await captureRef(cvRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Thành công', 'Đã lưu CV vào thư viện!');
    } catch (error) {
      console.error('Error saving CV:', error);
      Alert.alert('Error', 'Lỗi khi lưu CV');
    }
  };

  const renderEducation = () => {
    if (!cv?.education?.length) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="book" size={20} color="#3498db" />
          <Text style={styles.sectionTitle}>Học vấn</Text>
        </View>
        
        {cv.education.map((edu, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{edu.school}</Text>
            <Text style={styles.itemSubtitle}>{edu.major}</Text>
            <Text style={styles.itemPeriod}>{edu.period}</Text>
            {edu.achievement && (
              <Text style={styles.itemContent}>- {edu.achievement}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderExperience = () => {
    if (!cv?.experience?.length) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="briefcase" size={20} color="#3498db" />
          <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
        </View>
        
        {cv.experience.map((exp, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{exp.company}</Text>
            <Text style={styles.itemSubtitle}>{exp.position}</Text>
            <Text style={styles.itemPeriod}>{exp.period}</Text>
            
            {exp.description.map((desc, i) => (
              <Text key={i} style={styles.itemContent}>- {desc}</Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderActivities = () => {
    if (!cv?.activities?.length) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="users" size={20} color="#3498db" />
          <Text style={styles.sectionTitle}>Hoạt động</Text>
        </View>
        
        {cv.activities.map((act, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{act.organization}</Text>
            <Text style={styles.itemSubtitle}>{act.position}</Text>
            <Text style={styles.itemPeriod}>{act.period}</Text>
            
            {act.description.map((desc, i) => (
              <Text key={i} style={styles.itemContent}>- {desc}</Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading CV...</Text>
      </View>
    );
  }

  if (!cv) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No CV data found</Text>
        <Button 
          title="Create CV" 
          onPress={() => navigation.navigate('CreateCVScreen')} 
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View ref={cvRef} style={styles.cvContainer}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <TouchableOpacity 
                style={styles.avatarPlaceholder}
                onPress={pickImage}
              >
                <MaterialIcons name="add-a-photo" size={30} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.headerText}>
            <Text style={styles.name}>{cv.fullName}</Text>
            <Text style={styles.position}>{cv.position}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactContainer}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL(`tel:${cv.phone}`)}
          >
            <Feather name="phone" size={16} color="#3498db" />
            <Text style={styles.contactText}>{cv.phone || 'Not provided'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL(`mailto:${cv.email}`)}
          >
            <Feather name="mail" size={16} color="#3498db" />
            <Text style={styles.contactText}>{cv.email || 'Not provided'}</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Feather name="map-pin" size={16} color="#3498db" />
            <Text style={styles.contactText}>{cv.address || 'Not provided'}</Text>
          </View>
        </View>

        {/* Objective */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={20} color="#3498db" />
            <Text style={styles.sectionTitle}>Mục tiêu nghề nghiệp</Text>
          </View>
          <Text style={styles.objectiveText}>
            {cv.objective || 'Chưa có thông tin mục tiêu nghề nghiệp'}
          </Text>
        </View>

        {/* Skills */}
        {cv.skills?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="award" size={20} color="#3498db" />
              <Text style={styles.sectionTitle}>Kỹ năng</Text>
            </View>
            <View style={styles.skillsContainer}>
              {cv.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {renderEducation()}
        {renderExperience()}
        {renderActivities()}

        {/* Hobbies */}
        {cv.hobbies?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="heart" size={20} color="#3498db" />
              <Text style={styles.sectionTitle}>Sở thích</Text>
            </View>
            <View style={styles.hobbiesContainer}>
              {cv.hobbies.map((hobby, index) => (
                <Text key={index} style={styles.hobbyItem}>• {hobby}</Text>
              ))}
            </View>
          </View>
        )}

{/* Certificates */}
        {cv.certificates?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="file-text" size={20} color="#3498db" />
              <Text style={styles.sectionTitle}>Chứng chỉ</Text>
            </View>
            {cv.certificates.map((cert, index) => (
              <Text key={index} style={styles.itemContent}>• {cert}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Nút lưu ảnh */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage}>
        <Text style={styles.saveButtonText}>Lưu CV dưới dạng ảnh</Text>
      </TouchableOpacity>
        <TouchableOpacity 
            style={styles.saveButton}
              onPress={() => navigation.navigate("EditCVScreen", {
                cvId: cvId,
                cvName: cv?.cvName || ''
            })}
        >
            <Text style={styles.saveButtonText}>Chỉnh sửa CV</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f0f2f5',
  },
  cvContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  position: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  contactContainer: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginLeft: 8,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  itemPeriod: {
    fontSize: 13,
    color: '#95a5a6',
    marginTop: 2,
  },
  itemContent: {
    fontSize: 13,
    color: '#2c3e50',
    marginTop: 2,
    paddingLeft: 8,
  },
  objectiveText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#3498db20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 13,
    color: '#3498db',
    fontWeight: '500',
  },
  hobbiesContainer: {
    marginTop: 8,
  },
  hobbyItem: {
    fontSize: 13,
    color: '#2c3e50',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreviewCVScreen;