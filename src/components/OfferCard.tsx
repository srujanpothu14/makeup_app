import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';

import { colors } from '../theme';

type Offer = {
  id: string;
  title: string;
  description?: string;
  discountPercent?: number;
  serviceId?: string;
};

const { width } = Dimensions.get('window');

export default function OfferCard({ offer, onPress }: { offer: Offer; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.title}>{offer.title}</Text>

      {offer.description ? <Text style={styles.desc}>{offer.description}</Text> : null}

      {typeof offer.discountPercent === 'number' && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{offer.discountPercent}% OFF</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: 12,
    top: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    width: width - 32,
  },
  desc: {
    color: colors.subdued,
    fontSize: 14,
  },

  title: {
    fontFamily: 'RalewayBold',
    fontSize: 18,
    marginBottom: 6,
  },
});
