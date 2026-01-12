import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { offers, seedServices } from '../mock/data';
import { colors } from '../theme';

/* -------------------- TYPES -------------------- */

type RootStackParamList = {
  OfferDetails: { id: string };
  ServiceDetail: { id: string };
  Booking: undefined;
};

type OfferDetailsRouteProp = RouteProp<RootStackParamList, 'OfferDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* -------------------- SCREEN -------------------- */

export default function OfferDetailsScreen() {
  const route = useRoute<OfferDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const { id } = route.params;

  const offer = offers.find(o => o.id === id);

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Offer not found</Text>
      </View>
    );
  }

  const service = seedServices.find(s => s.id === offer.serviceId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{offer.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{offer.discountPercent}% OFF</Text>
        </View>
      </View>

      <Text style={styles.description}>{offer.description}</Text>

      {service && (
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.servicePrice}>₹{service.price}</Text>

          <TouchableOpacity
            style={styles.serviceBtn}
            onPress={() => navigation.push('ServiceDetail', { id: service.id })}
          >
            <Text style={styles.serviceBtnText}>View Service</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Booking')}>
        <Text style={styles.bookBtnText}>Book with Offer</Text>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '700',
  },
  bookBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 20,
    paddingVertical: 12,
  },
  bookBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
  container: {
    backgroundColor: colors.backgroundSoft,
    flex: 1,
    padding: 16,
  },
  description: {
    color: colors.subdued,
    fontSize: 14,
    marginBottom: 16,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  serviceBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 12,
    paddingVertical: 8,
  },
  serviceBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  servicePrice: {
    color: colors.primary,
    fontWeight: '700',
    marginTop: 6,
  },
  serviceTitle: {
    fontFamily: 'RalewayBold',
    fontSize: 16,
  },
  title: {
    fontFamily: 'RalewayBold',
    fontSize: 22,
  },
});
