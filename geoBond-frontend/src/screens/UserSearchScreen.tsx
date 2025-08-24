import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

import { userService, UserProfile } from '../services/userService';
import { friendShipService } from '../services/friendshipService';
import { useSearchDebounce } from '../hooks/useDebounce';

const UserSearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(new Set());

  const { debouncedSearchTerm, isSearching } = useSearchDebounce(searchQuery, 500);

  // Search users when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchUsers(debouncedSearchTerm);
    } else {
      setUsers([]);
    }
  }, [debouncedSearchTerm]);

  const searchUsers = async (query: string) => {
    try {
      setIsLoading(true);
      const searchResults = await userService.searchUsers(query);
      setUsers(searchResults);
    } catch (error: any) {
      console.error('Search error:', error);
      Toast.show({
        type: 'error',
        text1: 'Search Failed',
        text2: error.message || 'Failed to search users',
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserPress = useCallback((user: UserProfile) => {
    navigation.navigate('UserProfile' as never, { userId: user._id } as never);
  }, [navigation]);

  const handleSendFriendRequest = useCallback(async (user: UserProfile) => {
    try {
      setLoadingRequests(prev => new Set(prev).add(user._id));
      
      await friendShipService.sendFriendRequest(user._id);
      
      setSentRequests(prev => new Set(prev).add(user._id));
      
      Toast.show({
        type: 'success',
        text1: 'Friend Request Sent',
        text2: `Request sent to ${user.fullName}`,
      });
    } catch (error: any) {
      console.error('Send friend request error:', error);
      
      let errorMessage = 'Failed to send friend request';
      if (error.message.includes('already exists')) {
        errorMessage = 'Friend request already exists';
        setSentRequests(prev => new Set(prev).add(user._id));
      }
      
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: errorMessage,
      });
    } finally {
      setLoadingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(user._id);
        return newSet;
      });
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setUsers([]);
    setSentRequests(new Set());
    setLoadingRequests(new Set());
  }, []);

  const renderUser = useCallback(({ item }: { item: UserProfile }) => (
    <UserCard
      user={item}
      onPress={() => handleUserPress(item)}
      showFriendButton={true}
      onFriendRequest={() => handleSendFriendRequest(item)}
      isRequestSent={sentRequests.has(item._id)}
      isLoading={loadingRequests.has(item._id)}
    />
  ), [handleUserPress, handleSendFriendRequest, sentRequests, loadingRequests]);

  const renderContent = () => {
    if (!searchQuery.trim()) {
      return (
        <EmptyState
          icon="search-outline"
          title="Search for Friends"
          message="Enter an email address to find and connect with friends"
        />
      );
    }

    if (isLoading || isSearching) {
      return <LoadingState message="Searching users..." />;
    }

    if (users.length === 0) {
      return (
        <EmptyState
          icon="person-outline"
          title="No Users Found"
          message={`No users found for "${searchQuery}". Try a different search term.`}
        />
      );
    }

    return (
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Friends</Text>
        <Text style={styles.headerSubtitle}>
          Search by email to connect with friends
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by email address..."
        isLoading={isSearching}
        onClear={handleClearSearch}
        autoFocus={true}
      />

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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default UserSearchScreen;