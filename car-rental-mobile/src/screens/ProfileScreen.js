import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen(){
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-semibold mb-3">Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <View className="mt-4">
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}
