import api from './api';

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  bio?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  lastKnownLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  isPaidUser: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface SearchUsersResponse {
  status: 'success' | 'error';
  data: UserProfile[];
  message?: string;
}

class UserService {
  // Get user profile by ID
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>(`/auth/user/${userId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch user profile');
    } catch (error: any) {
      console.error('Get user profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }

  // Search users with debouncing support
  async searchUsers(searchQuery: string): Promise<UserProfile[]> {
    try {
      if (!searchQuery.trim()) {
        return [];
      }

      const response = await api.get<SearchUsersResponse>(
        `/auth/getAllUsers?search=${encodeURIComponent(searchQuery.trim())}`
      );
      
      if (response.data.status === 'success') {
        return response.data.data || [];
      }
      
      throw new Error(response.data.message || 'Failed to search users');
    } catch (error: any) {
      console.error('Search users error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>('/auth/getProfile');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error: any) {
      console.error('Get current user profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await api.put<ApiResponse<UserProfile>>('/auth/updateProfile', profileData);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Validate profile data before sending
  validateProfileData(data: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.fullName !== undefined) {
      if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
      }
    }

    if (data.phone !== undefined && data.phone) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid phone number');
      }
    }

    if (data.bio !== undefined && data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    if (data.dob !== undefined && data.dob) {
      const birthDate = new Date(data.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (isNaN(birthDate.getTime()) || age < 13 || age > 120) {
        errors.push('Please enter a valid date of birth (age must be between 13-120)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const userService = new UserService();