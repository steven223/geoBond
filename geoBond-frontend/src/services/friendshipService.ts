import api from './api';

export interface User {
  _id: string;
  email: string;
  fullName: string;
}

export interface FriendRequest {
  _id: string;
  fromUserId: User;
  toUserId: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  _id: string;
  email: string;
  fullName: string;
  gender?: string;
  requestId?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface FriendsResponse {
  data: Friend[];
  status: string;
}

export interface LocationHistory {
  _id: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  friendId: string;
  allUserAddress: {
    text: string;
    place_name: string;
  }[];
}

export interface LocationHistoryResponse {
  data: LocationHistory[];
  status: string;
}

export interface UserStats {
  friends: number;
  locations: number;
  shared: number;
}

export interface RequestCounts {
  incoming: number;
  outgoing: number;
  total: number;
}

export interface Activity {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'location_share' | 'location_update';
  userName: string;
  userId: string;
  message: string;
  timestamp: string;
}

export interface FriendWithStatus {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  location: string;
  lastSeen: string;
}

// Search for users by email
export const searchUsers = async (search: string): Promise<User[]> => {
  try {
    const response = await api.get(`/friendship/searchFriends?search=${encodeURIComponent(search)}`);
    return response.data.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Send friend request
export const sendFriendRequest = async (toUserId: string): Promise<any> => {
  try {
    const response = await api.post('/friendship/request', { toUserId });
    return response.data;
  } catch (error) {
    console.error('Send friend request error:', error);
    throw error;
  }
};

// Get incoming friend requests
export const getIncomingRequests = async (): Promise<FriendRequest[]> => {
  try {
    const response = await api.get('/friendship/requests/incoming');
    return response.data.data;
  } catch (error) {
    console.error('Get incoming requests error:', error);
    throw error;
  }
};

// Get outgoing friend requests
export const getOutgoingRequests = async (): Promise<FriendRequest[]> => {
  try {
    const response = await api.get('/friendship/requests/outgoing');
    return response.data.data;
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    throw error;
  }
};

// Accept friend request
export const acceptFriendRequest = async (requestId: string): Promise<any> => {
  try {
    const response = await api.put(`/friendship/request/${requestId}/accept`);
    return response.data;
  } catch (error) {
    console.error('Accept friend request error:', error);
    throw error;
  }
};

// Reject friend request
export const rejectFriendRequest = async (requestId: string): Promise<any> => {
  try {
    const response = await api.put(`/friendship/request/${requestId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Reject friend request error:', error);
    throw error;
  }
};

// Get friends list
export const getFriends = async (): Promise<FriendsResponse> => {
  try {
    const response = await api.get('/friendship/friends');
    return response.data;
  } catch (error) {
    console.error('Get friends error:', error);
    throw error;
  }
};

// Get friend's location history
export const getFriendLocationHistory = async (friendId: string): Promise<LocationHistoryResponse> => {
  try {
    const response = await api.get(`/friendship/friend/${friendId}/location-history`);
    return response.data;
  } catch (error) {
    console.error('Get friend location history error:', error);
    throw error;
  }
};

// Get request history
export const getRequestHistory = async (): Promise<FriendRequest[]> => {
  try {
    const response = await api.get('/friendship/requests/history');
    return response.data.data;
  } catch (error) {
    console.error('Get request history error:', error);
    throw error;
  }
};

// Get friend request counts
export const getRequestCounts = async (): Promise<RequestCounts> => {
  try {
    const response = await api.get('/friendship/requests/count');
    return response.data.data;
  } catch (error) {
    console.error('Get request counts error:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await api.get('/friendship/stats');
    return response.data.data;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
};

// Get recent activities
export const getRecentActivities = async (limit: number = 10): Promise<Activity[]> => {
  try {
    const response = await api.get(`/friendship/activities/recent?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Get recent activities error:', error);
    throw error;
  }
};

// Get friends with online status
export const getFriendsWithStatus = async (): Promise<FriendWithStatus[]> => {
  try {
    const response = await api.get('/friendship/friends/status');
    return response.data.data;
  } catch (error) {
    console.error('Get friends with status error:', error);
    throw error;
  }
};

export const friendShipService = {
  searchUsers,
  sendFriendRequest,
  getIncomingRequests,
  getOutgoingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendLocationHistory,
  getRequestHistory,
  getRequestCounts,
  getUserStats,
  getRecentActivities,
  getFriendsWithStatus,
};
