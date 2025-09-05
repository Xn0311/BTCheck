import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type NewsDetailRouteProp = RouteProp<
  { params: { title: string; summary: string; content: string } },
  'params'
>;

const NewsDetailScreen = () => {
  const route = useRoute<NewsDetailRouteProp>();
  const { title, summary, content } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Ảnh minh họa tin tức */}
      <Image
        source={require('../../assets/Cv/istockphoto-1478962894-612x612.jpg')} // đổi đường dẫn phù hợp với project của bạn
        style={styles.image}
        resizeMode="cover"
      /> 
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.sectionLabel}>Tóm tắt</Text>
      <Text style={styles.summary}>{summary}</Text>

      <Text style={styles.sectionLabel}>Chi tiết</Text>
      <Text style={styles.content}>{content}</Text>
    </ScrollView>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  image: {
    marginTop: '10%',
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
});
