import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-url-polyfill/auto';

function RootSwitch() {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator /></View>
  );
  return <NavigationContainer>{user ? <AppStack/> : <AuthStack/>}</NavigationContainer>;
}

export default function App(){
  return (
    <AuthProvider>
      <RootSwitch />
    </AuthProvider>
  );
}
