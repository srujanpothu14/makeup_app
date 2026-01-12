import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../theme';

export default React.memo(function CarouselDots({
  count,
  active,
}: {
  count: number;
  active: number;
}) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.active]} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  active: { backgroundColor: colors.primary, width: 18 },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    backgroundColor: colors.mutedLight,
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
});
