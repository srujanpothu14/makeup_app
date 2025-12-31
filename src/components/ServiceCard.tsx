
import React from 'react';
import { Card, Button, Text } from 'react-native-paper';
import { Service } from '../types';

export default function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  return (
    <Card style={{ marginBottom: 12 }} onPress={onPress}>
      <Card.Title title={service.title} subtitle={`${service.category} • ${service.durationMin} mins`} />
      <Card.Cover source={{ uri: service.thumbnailUrl ?? 'https://picsum.photos/300' }} />
      <Card.Actions>
        <Text style={{ fontWeight: '600' }}>₹{service.price}</Text>
        <Button onPress={onPress}>Book</Button>
      </Card.Actions>
    </Card>
  );
}
