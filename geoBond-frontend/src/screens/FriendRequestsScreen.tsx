import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import FriendRequestCard from '../components/FriendRequestCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

import { friendShipService, FriendRequest } from '../services/friendshipService';

type TabType = 'incoming' | 'outgoing';

const FriendRequestsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('incoming');
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [incoming, outgoing] = await Promise.all([
        friendShipService.getIncomingRequests(),
        friendShipService.getOutgoingRequests(),
      ]);

      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error: any) {
      console.error('Load requests error:', error);
      Toast.show({
        type: 'error',
        text1: 'Load Failed',
        text2: error.message || 'Failed to load friend requests',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadRequests(true);
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(requestId));
      
      await friendShipService.acceptFriendRequest(requestId);
      
      // Remove from incoming requests
      setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
      
      Toast.show({
        type: 'success',
        text1: 'Friend Request Accepted',
        text2: 'You are now friends!',
      });
    } catch (error: any) {
      console.error('Accept request error:', error);
      Toast.show({
        type: 'error',
        text1: 'Accept Failed',
        text2: error.message || 'Failed to accept friend request',
      });
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const request = incomingRequests.find(req => req._id === requestId);
    if (!request) return;

    Alert.alert(
      'Reject Friend Request',
      `Reject friend request from ${request.fromUserId.fullName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingRequests(prev => new Set(prev).add(requestId));
              
              await friendShipService.rejectFriendRequest(requestId);
              
              // Remove from incoming requests
              setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
              
              Toast.show({
                type: 'info',
                text1: 'Friend Request Rejected',
                text2: 'Request has been declined',
              });
            } catch (error: any) {
              console.error('Reject request error:', error);
              Toast.show({
                type: 'error',
                text1: 'Reject Failed',
                text2: error.message || 'Failed to reject friend request',
              });
            } finally {
              setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
              });
            }
          },
        },
      ]
    );
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile' as never, { userId } as never);
  };

  const renderRequest = useCallback(({ item }: { item: FriendRequest }) => (
    <FriendRequestCard
      request={item}
      type={activeTab}
      onAccept={handleAcceptRequest}
      onReject={handleRejectRequest}
      onUserPress={handleUserPress}
      isLoading={processingRequests.has(item._id)}
    />
  ), [activeTab, processingRequests]);

  const getCurrentRequests = () => {
    return activeTab === 'incoming' ? incomingRequests : outgoingRequests;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message="Loading friend requests..." />;
    }

    const requests = getCurrentRequests();
    
    if (requests.length === 0) {
      return (
        <EmptyState
          icon={activeTab === 'incoming' ? 'mail-outline' : 'paper-plane-outline'}
          title={activeTab === 'incoming' ? 'No Incoming Requests' : 'No Outgoing Requests'}
          message={
            activeTab === 'incoming'
              ? 'You have no pending friend requests'
              : 'You have not sent any friend requests'
          }
          actionText={activeTab === 'incoming' ? 'Find Friends' : undefined}
          onAction={activeTab === 'incoming' ? () => navigation.navigate('UserSearch' as never) : undefined}
        />
      );
    }

    return (
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    );
  };

  const incomingCount = incomingRequests.filter(req => req.status === 'pending').length;
  const outgoingCount = outgoingRequests.filter(req => req.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friend Requests</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('UserSearch' as never)}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'incoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('incoming')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'incoming' && styles.activeTabText,
          ]}>
            Received
          </Text>
          {incomingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{incomingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'outgoing' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('outgoing')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'outgoing' && styles.activeTabText,
          ]}>
            Sent
          </Text>
          {outgoingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{outgoingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default FriendRequestsScreen;