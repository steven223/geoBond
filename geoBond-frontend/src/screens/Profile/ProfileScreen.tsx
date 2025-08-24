import React, { useContext } from 'react';
import { View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import UserProfileScreen from '../UserProfileScreen';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <View />;
  }

  // Use the enhanced UserProfileScreen for current user's profile
  // We'll pass the current user's ID to show their own profile
  return <UserProfileScreen />;
};


export default ProfileScreen