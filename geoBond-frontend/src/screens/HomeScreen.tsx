import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useConnectedUsers } from '../hooks/useConnectedUsers';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, GRADIENTS } from '../constants/theme';
import HeroSection from '../components/HeroSection';
import QuickActionCard from '../components/QuickActionCard';
import SectionHeader from '../components/SectionHeader';
import StatsCard from '../components/StatsCard';
import ActivityItem from '../components/ActivityItem';
import FriendCard from '../components/FriendCard';
import MapPreview from '../components/MapPreview';
import LoadingState from '../components/LoadingState';
import { friendShipService, UserStats, Activity, FriendWithStatus, RequestCounts } from '../services/friendshipService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

// Quick actions for the home screen - moved inside component to access connectedUsersCount
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: 'search' | 'location';
  screen: keyof RootStackParamList;   // 👈 important
  gradient: 'primary' | 'accent';
  badge?: number;
};


const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  // const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);
  const { connectedUsersCount } = useConnectedUsers();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    friends: 0,
    locations: 0,
    shared: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [friendHighlights, setFriendHighlights] = useState<FriendWithStatus[]>([]);
  const [requestCounts, setRequestCounts] = useState<RequestCounts>({
    incoming: 0,
    outgoing: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadHomeData();
  }, []);

  // Function to load all home screen data
  const loadHomeData = async () => {
    try {
      setIsLoading(true);

      // Load all data in parallel
      const [statsData, activitiesData, friendsData, countsData] = await Promise.all([
        friendShipService.getUserStats(),
        friendShipService.getRecentActivities(5),
        friendShipService.getFriendsWithStatus(),
        friendShipService.getRequestCounts(),
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
      setFriendHighlights(friendsData.slice(0, 3)); // Show only first 3
      setRequestCounts(countsData);
    } catch (error) {
      console.error('Error loading home data:', error);
      Toast.show({
        type: 'error',
        text1: 'Load Failed',
        text2: 'Failed to load home screen data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Show confirmation toast
      Toast.show({
        type: 'info',
        text1: 'Confirm Logout',
        text2: 'Are you sure you want to logout?',
        visibilityTime: 5000,
        onPress: async () => {
          Toast.hide();

          // Show loading toast
          Toast.show({
            type: 'info',
            text1: 'Logging Out...',
            text2: 'Please wait',
          });

          try {
            // Perform logout
            await logout();

            // Show success message
            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'You have been successfully logged out.',
            });
          } catch (logoutError) {
            console.error('Error during logout:', logoutError);
            Toast.show({
              type: 'error',
              text1: 'Logout Error',
              text2: 'Failed to logout. Please try again.',
            });
          }
        }
      });
    } catch (error) {
      console.error('Error showing logout confirmation:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadHomeData();
      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Your data has been refreshed.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Refresh Failed',
        text2: 'Failed to refresh data',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Function to render quick actions grid
  const renderQuickActions = () => {
    const quickActions = [
      {
        id: '1',
        title: 'Find Friends',
        subtitle: 'Search & connect',
        icon: 'search' as const,
        screen: 'UserSearch',
        gradient: 'primary' as const,
      },
      {
        id: '2',
        title: 'Share Location',
        subtitle: `${connectedUsersCount} users online`,
        icon: 'location' as const,
        screen: 'MapScreen',
        gradient: 'accent' as const,
        badge: connectedUsersCount > 0 ? connectedUsersCount : undefined,
      },
      {
        id: '3',
        title: 'Friend Requests',
        subtitle: 'Manage connections',
        icon: 'person-add' as const,
        screen: 'FriendRequests',
        gradient: 'secondary' as const,
      },
      {
        id: '4',
        title: 'My Profile',
        subtitle: 'Edit your info',
        icon: 'person' as const,
        screen: 'Profile',
        gradient: 'purple' as const,
      },
    ];
    // const quickActions: QuickAction[] = [
    //   {
    //     id: '1',
    //     title: 'Find Friends',
    //     subtitle: 'Search & connect',
    //     icon: 'search',
    //     screen: 'UserSearch',
    //     gradient: 'primary',
    //   },
    //   {
    //     id: '2',
    //     title: 'Share Location',
    //     subtitle: `${connectedUsersCount} users online`,
    //     icon: 'location',
    //     screen: 'MapScreen',
    //     gradient: 'accent',
    //     badge: connectedUsersCount > 0 ? connectedUsersCount : undefined,
    //   },
    //   {
    //     id: '3',
    //     title: 'Friend Requests',
    //     subtitle: 'Manage connections',
    //     icon: 'person-add',
    //     screen: 'FriendRequests',
    //     gradient: 'secondary',
    //   },
    //   {
    //     id: '4',
    //     title: 'My Profile',
    //     subtitle: 'Edit your info',
    //     icon: 'person',
    //     screen: 'Profile',
    //     gradient: 'purple',
    //   },
    // ];
    return (
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            title={quickActions[0].title}
            subtitle={quickActions[0].subtitle}
            icon={quickActions[0].icon}
            gradient={quickActions[0].gradient}
            badge={quickActions[0].badge}
            onPress={() => navigation.navigate(quickActions[0].screen)} // ✅ no error
            style={styles.quickActionCard}
          />
          <QuickActionCard
            title={quickActions[1].title}
            subtitle={quickActions[1].subtitle}
            icon={quickActions[1].icon}
            gradient={quickActions[1].gradient}
            badge={quickActions[1].badge}
            onPress={() => navigation.navigate(quickActions[1].screen)}
            style={styles.quickActionCard}
          />
        </View>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            title={quickActions[2].title}
            subtitle={quickActions[2].subtitle}
            icon={quickActions[2].icon}
            gradient={quickActions[2].gradient}
            badge={requestCounts.incoming > 0 ? requestCounts.incoming : undefined}
            onPress={() => navigation.navigate(quickActions[2].screen)}
            style={styles.quickActionCard}
          />
          <QuickActionCard
            title={quickActions[3].title}
            subtitle={quickActions[3].subtitle}
            icon={quickActions[3].icon}
            gradient={quickActions[3].gradient}
            badge={quickActions[3].badge}
            onPress={() => navigation.navigate(quickActions[3].screen)}
            style={styles.quickActionCard}
          />
        </View>
      </View>
    );
  };

  // Function to render stats section
  const renderStats = () => {
    return (
      <View style={styles.statsContainer}>
        <StatsCard
          title="Friends"
          value={stats.friends}
          icon="people"
          iconColor={COLORS.primary}
          compact
        />
        <StatsCard
          title="Locations"
          value={stats.locations}
          icon="location"
          iconColor={COLORS.accent}
          compact
        />
        <StatsCard
          title="Shared"
          value={stats.shared}
          icon="share"
          iconColor={COLORS.secondary}
          compact
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {isLoading ? (
        <LoadingState message="Loading your dashboard..." />
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.primary]}
            />
          }
        >
          {/* Hero Section */}
          <HeroSection
            userName={user?.fullName || 'User'}
            subtitle="Ready to connect and share?"
            style={styles.heroSection}
          />

          {/* Header with logout button */}
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <SectionHeader
              title="Your Stats"
              subtitle="Your GeoBond activity overview"
              icon="stats-chart"
            />
            {renderStats()}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <SectionHeader
              title="Quick Actions"
              subtitle="What would you like to do?"
              icon="flash"
            />
            {renderQuickActions()}
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <SectionHeader
              title="Recent Activity"
              subtitle="Latest updates from your network"
              actionText="View All"
              onActionPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Activity screen will be available soon!',
                });
              }}
              icon="time"
            />
            <View style={styles.activityList}>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    type={activity.type}
                    userName={activity.userName}
                    message={activity.message}
                    timestamp={new Date(activity.timestamp).toLocaleString()}
                    onPress={() => {
                      // Handle activity item press
                      navigation.navigate('UserProfile', { userId: activity.userId });
                    }}
                  />
                ))
              ) : (
                <View style={{ padding: SPACING.lg, alignItems: 'center' }}>
                  <Text style={[TYPOGRAPHY.body2, { color: COLORS.textSecondary }]}>
                    No recent activities
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Map Preview */}
          <View style={styles.section}>
            <SectionHeader
              title="Location Map"
              subtitle="See where your friends are"
              actionText="Open Map"
              onActionPress={() => navigation.navigate('MapScreen')}
              icon="map"
            />
            <MapPreview
              friendsCount={friendHighlights.filter(f => f.status === 'online').length}
              onPress={() => navigation.navigate('MapScreen')}
            />
          </View>

          {/* Friend Highlights */}
          <View style={styles.section}>
            <SectionHeader
              title="Friends Online"
              subtitle="See who's active right now"
              actionText="View All"
              onActionPress={() => navigation.navigate('Friends')}
              icon="people"
            />
            <View style={styles.friendsList}>
              {friendHighlights.length > 0 ? (
                friendHighlights.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    name={friend.name}
                    status={friend.status}
                    location={friend.location}
                    lastSeen={friend.status === 'offline' ? friend.lastSeen : undefined}
                    compact
                    onPress={() => navigation.navigate('UserProfile', { userId: friend.id })}
                    onLocationPress={() => navigation.navigate('MapScreen', { userId: friend.id })}
                    onMessagePress={() => {
                      Toast.show({
                        type: 'info',
                        text1: 'Coming Soon',
                        text2: 'Messaging feature will be available soon!',
                      });
                    }}
                  />
                ))
              ) : (
                <View style={{ padding: SPACING.lg, alignItems: 'center' }}>
                  <Text style={[TYPOGRAPHY.body2, { color: COLORS.textSecondary }]}>
                    No friends online right now
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: SPACING.xxxl }} />
        </ScrollView>
      )}
    </View>
  );
};
export type RootStackParamList = {
  UserSearch: undefined;
  UserProfile: { userId: string };
  Home: undefined;
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    marginBottom: -SPACING.lg, // Overlap with content below
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
    ...SHADOWS.small,
  },
  logoutText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.lg,
  },
  quickActionsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  activityList: {
    paddingHorizontal: SPACING.lg,
  },
  friendsList: {
    paddingHorizontal: 0,
  },
});
