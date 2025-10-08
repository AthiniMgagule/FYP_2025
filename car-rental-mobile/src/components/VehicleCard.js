import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function VehicleCard({ vehicle, onBook }) {
  return (
    <View className="flex-row border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white">
      <Image source={{ uri: vehicle.image || 'https://via.placeholder.com/150' }} className="w-28 h-20" />
      <View className="flex-1 p-3">
        <Text className="text-lg font-semibold text-gray-900">{vehicle.make} {vehicle.model}</Text>
        <Text className="text-gray-500 mt-1">{vehicle.category} • {vehicle.seats} seats</Text>
        <Text className="text-blue-600 font-bold mt-2">R{vehicle.pricePerDay}/day</Text>
        <TouchableOpacity className="mt-3 bg-blue-500 px-4 py-2 rounded-lg" onPress={onBook}>
          <Text className="text-white text-center font-medium">Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
