import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequest } from '../services/friendshipService';

interface FriendRequestCardProps {
  request: FriendRequest;
  type: 'incoming' | 'outgoing';
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onUserPress?: (userId: string) => void;
  isLoading?: boolean;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
  onUserPress,
  isLoading = false,
}) => {
  const user = type === 'incoming' ? request.fromUserId : request.toUserId;
  
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
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'accepted':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#FF9500';
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userSection}
        onPress={() => onUserPress?.(user._id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {user.profileImageUrl ? (
            <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
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
          <View style={styles.requestInfo}>
            <Text style={styles.requestTime}>{formatDate(request.createdAt)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {type === 'incoming' && request.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onReject?.(request._id)}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color="#FF3B30" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onAccept?.(request._id)}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={18} color="#34C759" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
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
    marginBottom: 6,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#E8F5E8',
  },
  rejectButton: {
    backgroundColor: '#FFE8E8',
  },
});

export default FriendRequestCard;