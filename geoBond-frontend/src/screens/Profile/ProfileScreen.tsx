import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const user = {
  name: 'Admin',
  username: 'admin@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
  bio: 'Loves coding, coffee & hiking 🚀',
  location: 'San Francisco, CA',
  stats: {
    friends: 48,
    favourites: 127,
    visited: 12,
  },
};

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <Text style={styles.bio}>{user.bio}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{user.location}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="people" size={20} color="#007BFF" />
          <Text style={styles.statNumber}>{user.stats.friends}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.statNumber}>{user.stats.favourites}</Text>
          <Text style={styles.statLabel}>Favourites</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="map" size={20} color="#4CD964" />
          <Text style={styles.statNumber}>{user.stats.visited}</Text>
          <Text style={styles.statLabel}>Visited</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={16} color="#fff" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    alignItems: 'center',
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: '#007BFF',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  username: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  bio: {
    textAlign: 'center',
    color: '#444',
    paddingHorizontal: 24,
    fontSize: 15,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 28,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#c2d1e1',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
    width: 98,
  },
  statNumber: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#222',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 26,
    backgroundColor: '#007BFF',
    borderRadius: 28,
    marginTop: 18,
    shadowColor: '#007BFF',
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ProfileScreen