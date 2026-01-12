import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import dayjs from 'dayjs';
import { RouteProp } from '@react-navigation/native';

import { createBooking } from '../mock/api';
import { colors } from '../theme';
import { useAuthStore } from '../store/useAuthStore';

/* -------------------- TYPES -------------------- */

type RootStackParamList = {
  Booking: { id: string };
};

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

type Props = {
  route: BookingScreenRouteProp;
};

/* -------------------- SCREEN -------------------- */

export default function BookingScreen({ route }: Props) {
  const { id: serviceId } = route.params;
  const { user } = useAuthStore();
  const [selected, setSelected] = useState<string | null>(null);

  const slots = Array.from({ length: 6 }, (_, i) =>
    dayjs()
      .add(i + 1, 'day')
      .hour(11)
      .minute(0)
      .second(0)
      .toISOString(),
  );

  const confirm = async () => {
    if (!user || !selected) return;
    await createBooking({ serviceId, userId: user.id, startTime: selected });
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.warningText}>You must be logged in to make a booking.</Text>
      </View>
    );
  }

  if (!serviceId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.warningText}>
          Service ID is missing. Please navigate to this screen properly.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a time</Text>

      {slots.map(iso => (
        <Button
          key={iso}
          mode={selected === iso ? 'contained' : 'outlined'}
          style={styles.slotButton}
          onPress={() => setSelected(iso)}
        >
          <Text style={styles.slotText}>{dayjs(iso).format('ddd, D MMM • h:mm A')}</Text>
        </Button>
      ))}

      <Button mode="contained" disabled={!selected} onPress={confirm} style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm Booking</Text>
      </Button>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    marginTop: 12,
  },
  confirmText: {
    color: colors.white,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  slotButton: {
    marginBottom: 8,
  },
  slotText: {
    color: colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  warningText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
});
