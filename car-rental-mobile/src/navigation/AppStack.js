import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VehicleListScreen from '../screens/VehicleListScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
export default function AppStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Vehicles" component={VehicleListScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
