import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';
import LoadingState from '../components/LoadingState';

import { userService, UserProfile } from '../services/userService';
import { AuthContext } from '../context/AuthContext';

type EditProfileRouteParams = {
  EditProfile: {
    userProfile?: UserProfile;
  };
};

type EditProfileRouteProp = RouteProp<EditProfileRouteParams, 'EditProfile'>;

interface FormData {
  fullName: string;
  phone: string;
  bio: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<EditProfileRouteProp>();
  const { user: currentUser } = useContext(AuthContext);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    bio: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    country: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Use profile from route params if available, otherwise fetch current user profile
      let profile: UserProfile;
      if (route.params?.userProfile) {
        profile = route.params.userProfile;
      } else {
        profile = await userService.getCurrentUserProfile();
      }
      
      setUserProfile(profile);
      
      // Populate form with existing data
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
      });
    } catch (error: any) {
      console.error('Load profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Load Failed',
        text2: error.message || 'Failed to load profile',
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (isNaN(birthDate.getTime()) || age < 13 || age > 120) {
        newErrors.dob = 'Please enter a valid date of birth (age must be between 13-120)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors before saving',
      });
      return;
    }

    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: saveProfile,
        },
      ]
    );
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);

      const updateData: Partial<UserProfile> = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        dob: formData.dob || undefined,
        gender: formData.gender as 'male' | 'female' | 'other' || undefined,
        location: {
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          country: formData.country.trim() || undefined,
        },
      };

      const updatedProfile = await userService.updateProfile(updateData);
      
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
      });

      // Navigate back with updated profile
      navigation.goBack();
    } catch (error: any) {
      console.error('Save profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: error.message || 'Failed to update profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!userProfile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Profile</Text>
          
          <TouchableOpacity
            style={[
              styles.headerButton,
              styles.saveButton,
              isSaving && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <Ionicons name="hourglass-outline" size={20} color="#007AFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.avatarContainer}>
              {userProfile.profileImageUrl ? (
                <Image source={{ uri: userProfile.profileImageUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{getInitials(formData.fullName || userProfile.fullName)}</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity style={styles.changePhotoButton} activeOpacity={0.7}>
              <Ionicons name="camera" size={16} color="#007AFF" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <FormInput
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
              placeholder="Enter your full name"
              icon="person-outline"
              error={errors.fullName}
              required
            />

            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              icon="call-outline"
              error={errors.phone}
            />

            <FormInput
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => updateFormData('bio', text)}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              maxLength={500}
              icon="document-text-outline"
              error={errors.bio}
            />

            <FormInput
              label="Date of Birth"
              value={formData.dob}
              onChangeText={(text) => updateFormData('dob', text)}
              placeholder="YYYY-MM-DD"
              icon="calendar-outline"
              error={errors.dob}
            />

            <FormPicker
              label="Gender"
              value={formData.gender}
              onValueChange={(value) => updateFormData('gender', value)}
              options={genderOptions}
              placeholder="Select your gender"
              icon="person-outline"
              error={errors.gender}
            />

            {/* Location Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>

            <FormInput
              label="City"
              value={formData.city}
              onChangeText={(text) => updateFormData('city', text)}
              placeholder="Enter your city"
              icon="business-outline"
              error={errors.city}
            />

            <FormInput
              label="State/Province"
              value={formData.state}
              onChangeText={(text) => updateFormData('state', text)}
              placeholder="Enter your state or province"
              icon="map-outline"
              error={errors.state}
            />

            <FormInput
              label="Country"
              value={formData.country}
              onChangeText={(text) => updateFormData('country', text)}
              placeholder="Enter your country"
              icon="globe-outline"
              error={errors.country}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profilePictureSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '600',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
});

export default EditProfileScreen;