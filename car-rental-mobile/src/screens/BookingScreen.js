import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingScreen({ route, navigation }){
  const { vehicle } = route.params;
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now()+24*60*60*1000));
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleBook = async () => {
    if (!user) { Alert.alert('Not logged in', 'Please log in before booking'); return; }
    if (endDate <= startDate) { Alert.alert('Invalid dates', 'End date must be after start date'); return; }
    try {
      setSubmitting(true);
      const payload = { vehicleId: vehicle.id, userId: user.id, startDate: startDate.toISOString(), endDate: endDate.toISOString(), pickupLocation: 'Main Office' };
      await api.post('/bookings', payload);
      Alert.alert('Success', 'Booking confirmed');
      navigation.navigate('Vehicles');
    } catch (err) {
      Alert.alert('Booking error', err.response?.data?.message || err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-semibold mb-3">Book {vehicle.make} {vehicle.model}</Text>
      <Text className="mb-2">Pickup date</Text>
      <Button title={startDate.toDateString()} onPress={() => setShowStart(true)} />
      {showStart && <DateTimePicker value={startDate} mode="date" display="default" onChange={(e,d)=>{ setShowStart(false); if(d) setStartDate(d); }} />}
      <Text className="mt-4 mb-2">Return date</Text>
      <Button title={endDate.toDateString()} onPress={() => setShowEnd(true)} />
      {showEnd && <DateTimePicker value={endDate} mode="date" display="default" onChange={(e,d)=>{ setShowEnd(false); if(d) setEndDate(d); }} />}
      <View className="mt-6">
        <Button title={submitting ? 'Booking...' : 'Confirm Booking'} onPress={handleBook} disabled={submitting} />
      </View>
    </View>
  );
}
