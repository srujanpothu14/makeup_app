import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';

export default React.memo(function ActionButton({ icon, text, onPress }: any) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Ionicons name={icon} size={18} color={colors.white} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: { color: colors.white, fontSize: 13, fontWeight: '600' },
});
