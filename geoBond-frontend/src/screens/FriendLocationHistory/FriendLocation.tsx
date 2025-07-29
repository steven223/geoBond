import React, { useEffect, useState } from 'react';
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
import { useRoute } from '@react-navigation/native';
import { Friend, FriendsResponse, LocationHistory, LocationHistoryResponse, friendShipService } from '../../services/friendshipService';


const FriendLocation = ({ route }: { route: any }) => {
  const [history, setHistory] = useState<LocationHistoryResponse>({
    data: [],
    status: '',
  });
  const { friendId } = route.params;
  let dateFormat = (timestamp: string) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., Jan, Feb
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }
  const friendHistory = async () => {
    const response = await friendShipService.getFriendLocationHistory(friendId);
    console.log("Frineds History", response);
    setHistory(response);
  };

  useEffect(() => {
    friendHistory();
  }, []);

  const renderFriendItem = ({ item }: { item: LocationHistory }) => (
    console.log("item", item),
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        // navigation.navigate('FriendLocation', { friendId: item._id });
      }}
    >
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri: item?.allUserAddress[0]?.text || 'https://via.placeholder.com/56',
          }}
          style={styles.avatar}
        />
        {/* For now, online status is hardcoded or can be fetched later */}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{item?.allUserAddress[0]?.text}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#777" />
          <Text style={styles.locationText}>
            {dateFormat(item?.timestamp)}
          </Text>
        </View>
      </View>

      <MaterialIcons
        name="keyboard-arrow-right"
        size={24}
        color="#ccc"
        style={{ alignSelf: 'center' }}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <View style={styles.header}>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity onPress={() => {/* add friend navigation */ }}>
          <Ionicons name="person-add" size={28} color="#1e3c72" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={history.data}
        keyExtractor={item => item._id}
        renderItem={renderFriendItem}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default FriendLocation

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