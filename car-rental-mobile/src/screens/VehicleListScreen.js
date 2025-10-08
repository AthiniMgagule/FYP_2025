import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import api from '../services/api';
import VehicleCard from '../components/VehicleCard';

export default function VehicleListScreen({ navigation }){
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vehicles/available');
      setVehicles(res.data);
    } catch (err) { console.warn(err); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchVehicles(); }, []);

  if (loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator /></View>;

  return (
    <View className="flex-1 p-3 bg-white">
      <FlatList
        data={vehicles}
        keyExtractor={(item)=>String(item.id)}
        renderItem={({item}) => <VehicleCard vehicle={item} onBook={() => navigation.navigate('Booking',{ vehicle: item })} /> }
      />
    </View>
  );
}
