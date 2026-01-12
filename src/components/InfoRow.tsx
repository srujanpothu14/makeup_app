import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';

/* -------------------- TYPES -------------------- */

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon: IoniconName;
  text: string;
};

/* -------------------- COMPONENT -------------------- */

const InfoRow = React.memo(function InfoRow({ icon, text }: Props) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
});

InfoRow.displayName = 'InfoRow';

export default InfoRow;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  text: {
    color: colors.text,
    fontSize: 14,
  },
});
