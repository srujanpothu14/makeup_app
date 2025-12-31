
import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchService } from '../mock/api';
import { Button } from 'react-native-paper';

export default function ServiceDetailScreen() {
  const { params } = useRoute<any>();
  const nav = useNavigation<any>();
  const { data } = useQuery({ queryKey: ['service', params.id], queryFn: () => fetchService(params.id) });

  if (!data) return null;
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>{data.title}</Text>
      <Text style={{ marginTop: 8 }}>{data.description}</Text>
      <Text style={{ marginTop: 8 }}>Duration: {data.durationMin} mins</Text>
      <Text style={{ marginTop: 8, fontWeight: '600' }}>₹{data.price}</Text>
      <Button mode="contained" style={{ marginTop: 16 }} onPress={() => nav.navigate('Booking', { id: data.id })}>Choose Time</Button>
    </View>
  );
}
