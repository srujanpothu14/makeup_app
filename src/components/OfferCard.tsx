import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { colors } from '../theme';

type Offer = {
  id: string;
  title: string;
  description?: string;
  discountPercent?: number;
  serviceId?: string;
};

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
    right: 10,
    top: 10,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 100,
    marginBottom: 10,
    marginRight: 12,
    marginTop: 10,
    padding: 14,
    width: 150,
  },
  desc: { color: colors.subdued, fontSize: 13 },
  title: { fontFamily: 'RalewayBold', fontSize: 16, marginBottom: 4 },
});
