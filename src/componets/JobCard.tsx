import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Job = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  logo?: string;
};

const JobCard = ({ job, onPress }: { job: Job; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={['#ffffff', '#e6f8f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.row}>
          <View style={styles.logoContainer}>
            {job.logo ? (
              <Image source={{ uri: job.logo }} style={styles.logo} />
            ) : (
              <Ionicons name="briefcase-outline" size={32} color="#4CAF50" />
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            <Text style={styles.company} numberOfLines={1}>{job.company}</Text>

            <View style={styles.detailsRow}>
              <View style={styles.detail}>
                <Ionicons name="cash-outline" size={16} color="#2ecc71" />
                <Text style={styles.salary}>{job.salary}</Text>
              </View>

              <View style={styles.detail}>
                <Ionicons name="location-outline" size={16} color="#3498db" />
                <Text style={styles.location}>{job.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 3, 
    borderColor: "rgba(26, 117, 208, 0.6)",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#d9f4e9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 14,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  company: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
    flexWrap: 'wrap',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  salary: {
    fontSize: 13,
    color: '#2ecc71',
  },
  location: {
    fontSize: 13,
    color: '#3498db',
  },
});
