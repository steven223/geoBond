import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Friend, FriendsResponse, friendShipService } from '../services/friendshipService';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import GradientBackground from '../components/GradientBackground';
import SectionHeader from '../components/SectionHeader';
import FriendCard from '../components/FriendCard';
import SearchBar from '../components/SearchBar';


const FriendsScreen = () => {
  const navigation = useNavigation<any>();
  const [friends, setFriends] = useState<FriendsResponse>({
    data: [],
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  // Load friends when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFriendsList();
    }, [])
  );

  const fetchFriendsList = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const [friendsResponse, countsResponse] = await Promise.all([
        friendShipService.getFriends(),
        friendShipService.getRequestCounts(),
      ]);
      
      setFriends(friendsResponse);
      setFilteredFriends(friendsResponse.data);
      setRequestCount(countsResponse.incoming);
    } catch (error: any) {
      console.error("❌ Failed to fetch friends:", error);
      Toast.show({
        type: 'error',
        text1: 'Load Failed',
        text2: error.message || 'Failed to load friends list',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFriends(friends.data);
    } else {
      const filtered = friends.data.filter(friend =>
        friend.fullName.toLowerCase().includes(query.toLowerCase()) ||
        friend.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const handleRefresh = () => {
    fetchFriendsList(true);
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <FriendCard
      name={item.fullName}
      status={Math.random() > 0.5 ? 'online' : 'offline'} // Mock status
      location={item?.location?.city || 'Location not set'}
      lastSeen={Math.random() > 0.5 ? '2 hours ago' : undefined}
      onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
      onLocationPress={() => navigation.navigate('FriendLocation', { friendId: item._id })}
      onMessagePress={() => {
        Toast.show({
          type: 'info',
          text1: 'Coming Soon',
          text2: 'Messaging feature will be available soon!',
        });
      }}
    />
  );

  if (isLoading) {
    return <LoadingState message="Loading friends..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header with gradient */}
      <GradientBackground gradient="primary" style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>My Friends</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('FriendRequests')}
                >
                  <Ionicons name="mail" size={24} color={COLORS.white} />
                  {requestCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{requestCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('UserSearch')}
                >
                  <Ionicons name="person-add" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.subtitle}>
              {friends.data.length} {friends.data.length === 1 ? 'friend' : 'friends'} connected
            </Text>
          </View>
        </SafeAreaView>
      </GradientBackground>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <LoadingState message="Loading friends..." />
        ) : friends.data.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="No Friends Yet"
            message="Start connecting with friends to share your location and see theirs"
            actionText="Find Friends"
            onAction={() => navigation.navigate('UserSearch')}
          />
        ) : (
          <>
            <SectionHeader
              title={`${filteredFriends.length} Friends`}
              subtitle={searchQuery ? `Showing results for "${searchQuery}"` : 'Your connected friends'}
              style={styles.sectionHeader}
            />
            
            <FlatList
              data={filteredFriends}
              keyExtractor={item => item._id}
              renderItem={renderFriendItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingBottom: SPACING.xl,
  },
  headerContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    fontWeight: '700',
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.white,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: SPACING.md,
    padding: SPACING.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    ...TYPOGRAPHY.overline,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: SPACING.lg,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
});
