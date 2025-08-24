import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../services/userService';

interface UserCardProps {
  user: UserProfile;
  onPress: () => void;
  showFriendButton?: boolean;
  onFriendRequest?: () => void;
  isRequestSent?: boolean;
  isLoading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  showFriendButton = false,
  onFriendRequest,
  isRequestSent = false,
  isLoading = false,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLocation = () => {
    if (!user.location) return 'Location not set';
    const { city, state, country } = user.location;
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not set';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            {user.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
              </View>
            )}
            {user.isPaidUser && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.fullName}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.locationText} numberOfLines={1}>
                {formatLocation()}
              </Text>
            </View>
          </View>
        </View>

        {showFriendButton && onFriendRequest && (
          <TouchableOpacity
            style={[
              styles.friendButton,
              isRequestSent && styles.friendButtonSent,
              isLoading && styles.friendButtonLoading,
            ]}
            onPress={onFriendRequest}
            disabled={isRequestSent || isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <Ionicons name="hourglass-outline" size={16} color="#fff" />
            ) : isRequestSent ? (
              <Ionicons name="checkmark" size={16} color="#fff" />
            ) : (
              <Ionicons name="person-add" size={16} color="#fff" />
            )}
            <Text style={styles.friendButtonText}>
              {isLoading ? 'Sending...' : isRequestSent ? 'Sent' : 'Add'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  premiumBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  friendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    justifyContent: 'center',
  },
  friendButtonSent: {
    backgroundColor: '#34C759',
  },
  friendButtonLoading: {
    backgroundColor: '#999',
  },
  friendButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default UserCard;