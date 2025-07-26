import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const friends = [
  {
    id: '1',
    name: 'Anshul Sharma',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    online: true,
    location: 'Delhi',
  },
  {
    id: '2',
    name: 'Priya Mehra',
    avatar: 'https://randomuser.me/api/portraits/women/16.jpg',
    online: false,
    location: 'Mumbai',
  },
  {
    id: '3',
    name: 'Rahul Singh',
    avatar: 'https://randomuser.me/api/portraits/men/19.jpg',
    online: true,
    location: 'Pune',
  },
  {
    id: '4',
    name: 'Saumya Bajaj',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    online: true,
    location: 'Gurgaon',
  },
];

const FriendsScreen = () => {
  const renderFriendItem = ({ item }: { item: { id: string; name: string; avatar: string; online: boolean; location: string; } }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => {/* add friend navigation */}}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#777" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>

      <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity onPress={() => {/* add friend navigation */}}>
          <Ionicons name="person-add" size={28} color="#1e3c72" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        renderItem={renderFriendItem}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 2, // android shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3c72',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ade80',
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3c72',
  },
  locationRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
});
