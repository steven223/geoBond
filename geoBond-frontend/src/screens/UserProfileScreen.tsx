import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import LoadingState from '../components/LoadingState';
import { userService, UserProfile } from '../services/userService';
import { friendShipService } from '../services/friendshipService';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

type UserProfileRouteParams = {
  UserProfile: {
    userId: string;
  };
};

type UserProfileRouteProp = RouteProp<UserProfileRouteParams, 'UserProfile'>;

const UserProfileScreen: React.FC = () => {
  const route = useRoute<UserProfileRouteProp>();
  const navigation = useNavigation();
  const { user: currentUser, logout } = useContext(AuthContext);

  // Get userId from route params, or use current user's ID if not provided
  const userId = route.params?.userId || currentUser?._id || '';

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  // Reload profile when screen comes into focus (useful after editing)
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser?._id === userId) {
        loadUserProfile();
      }
    }, [userId, currentUser])
  );

  const loadUserProfile = async () => {
    if (!userId || !currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      let profile: UserProfile;

      // If viewing own profile, use getCurrentUserProfile for better data
      if (userId === currentUser._id) {
        profile = await userService.getCurrentUserProfile();
      } else {
        profile = await userService.getUserProfile(userId);
      }

      setUserProfile(profile);
    } catch (error: any) {
      console.error('Load user profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Profile Load Failed',
        text2: error.message || 'Failed to load user profile',
      });

      // Only navigate back if we're not in the main profile tab
      if (route.params?.userId) {
        navigation.goBack();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!userProfile) return;

    Alert.alert(
      'Send Friend Request',
      `Send a friend request to ${userProfile.fullName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: async () => {
            try {
              setIsSendingRequest(true);
              await friendShipService.sendFriendRequest(userProfile._id);
              setRequestSent(true);

              Toast.show({
                type: 'success',
                text1: 'Friend Request Sent',
                text2: `Request sent to ${userProfile.fullName}`,
              });
            } catch (error: any) {
              console.error('Send friend request error:', error);

              let errorMessage = 'Failed to send friend request';
              if (error.message.includes('already exists')) {
                errorMessage = 'Friend request already exists';
                setRequestSent(true);
              }

              Toast.show({
                type: 'error',
                text1: 'Request Failed',
                text2: errorMessage,
              });
            } finally {
              setIsSendingRequest(false);
            }
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLocation = () => {
    if (!userProfile?.location) return 'Location not set';
    const { city, state, country } = userProfile.location;
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not set';
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never, { userProfile } as never);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been successfully logged out',
              });
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: 'Failed to logout. Please try again.',
              });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!userProfile || !userId || !currentUser) {
    return null;
  }

  const isOwnProfile = currentUser?._id === userProfile._id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profile</Text>

            {isOwnProfile ? (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleEditProfile}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.headerButton, styles.logoutHeaderButton]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.headerButton} />
            )}
          </View>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {userProfile.profileImageUrl ? (
                <Image source={{ uri: userProfile.profileImageUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{getInitials(userProfile.fullName)}</Text>
                </View>
              )}
              {userProfile.isPaidUser && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                </View>
              )}
            </View>

            <Text style={styles.userName}>{userProfile.fullName}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>

            {userProfile.isPaidUser && (
              <View style={styles.premiumLabel}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.premiumText}>Premium User</Text>
              </View>
            )}

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Date(userProfile.createdAt).getFullYear()}
                </Text>
                <Text style={styles.statLabel}>Joined</Text>
              </View>

              {userProfile.dob && (
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {calculateAge(userProfile.dob)}
                  </Text>
                  <Text style={styles.statLabel}>Years Old</Text>
                </View>
              )}

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userProfile.isPaidUser ? 'Pro' : 'Free'}
                </Text>
                <Text style={styles.statLabel}>Plan</Text>
              </View>
            </View>

            {!isOwnProfile && (
              <TouchableOpacity
                style={[
                  styles.friendRequestButton,
                  requestSent && styles.friendRequestButtonSent,
                  isSendingRequest && styles.friendRequestButtonLoading,
                ]}
                onPress={handleSendFriendRequest}
                disabled={requestSent || isSendingRequest}
                activeOpacity={0.7}
              >
                {isSendingRequest ? (
                  <Ionicons name="hourglass-outline" size={20} color="#fff" />
                ) : requestSent ? (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                ) : (
                  <Ionicons name="person-add" size={20} color="#fff" />
                )}
                <Text style={styles.friendRequestButtonText}>
                  {isSendingRequest ? 'Sending...' : requestSent ? 'Request Sent' : 'Send Friend Request'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Bio Section */}
        {userProfile.bio && (
          <View style={styles.bioContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.bioText}>{userProfile.bio}</Text>
          </View>
        )}

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Profile Details</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Ionicons name="location-outline" size={24} color="#667eea" />
              </View>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{formatLocation()}</Text>
            </View>

            {userProfile.phone && (
              <View style={styles.detailCard}>
                <View style={styles.detailIcon}>
                  <Ionicons name="call-outline" size={24} color="#667eea" />
                </View>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{userProfile.phone}</Text>
              </View>
            )}

            {userProfile.gender && (
              <View style={styles.detailCard}>
                <View style={styles.detailIcon}>
                  <Ionicons name="person-outline" size={24} color="#667eea" />
                </View>
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>
                  {userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)}
                </Text>
              </View>
            )}

            {userProfile.dob && (
              <View style={styles.detailCard}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar-outline" size={24} color="#667eea" />
                </View>
                <Text style={styles.detailLabel}>Birthday</Text>
                <Text style={styles.detailValue}>{formatDate(userProfile.dob)}</Text>
              </View>
            )}

            <View style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={24} color="#667eea" />
              </View>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>{formatDate(userProfile.createdAt)}</Text>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Ionicons name="mail-outline" size={24} color="#667eea" />
              </View>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue} numberOfLines={2}>{userProfile.email}</Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutHeaderButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#667eea',
    fontSize: 42,
    fontWeight: '700',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  premiumLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 20,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8860B',
    marginLeft: 4,
  },
  friendRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 180,
    justifyContent: 'center',
  },
  friendRequestButtonSent: {
    backgroundColor: '#34C759',
  },
  friendRequestButtonLoading: {
    backgroundColor: '#999',
  },
  friendRequestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bioContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: (width - 72) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  detailIcon: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UserProfileScreen;