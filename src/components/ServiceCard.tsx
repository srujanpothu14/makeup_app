import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

import { colors } from '../theme';

type Service = {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  price: number;
  thumbnailUrl?: string;
};

type Props = {
  service: Service;
  onPress: () => void;
};

const ServiceCard: React.FC<Props> = ({ service, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      {/* CLIPPING CONTAINER */}
      <View style={styles.inner}>
        {/* IMAGE */}
        <Card.Cover
          source={{
            uri: service.thumbnailUrl ?? 'https://picsum.photos/300',
          }}
          style={styles.image}
        />

        {/* CONTENT */}
        <Card.Content style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {service.title}
          </Text>

          <Text numberOfLines={1} style={styles.subtitle}>
            {service.category} • {service.durationMin} mins
          </Text>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.price}>₹{service.price}</Text>

            <Button
              mode="contained"
              compact
              onPress={onPress}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              <Text>Book</Text>
            </Button>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 22,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flex: 1,
    margin: 8,
  },
  content: {
    backgroundColor: colors.white,
    paddingBottom: 14,
    paddingTop: 10,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  /* Taller image */
  image: {
    height: 180,
  },
  inner: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  price: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.accent,
    fontSize: 12,
    marginBottom: 10,
  },
  title: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
});

export default ServiceCard;
