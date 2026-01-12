import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';

import { colors } from '../theme';

/* -------------------- TYPES -------------------- */

type Props = {
  logo: ImageSourcePropType;
  studio: string;
  location?: string;
};

/* -------------------- COMPONENT -------------------- */

export default function HeroHeader({ logo, studio, location }: Props) {
  return (
    <View style={styles.row}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{studio}</Text>
        {location ? <Text style={styles.location}>{location}</Text> : null}
      </View>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  location: {
    color: colors.primary,
    fontSize: 13,
    marginTop: 4,
  },
  logo: {
    height: 70,
    resizeMode: 'contain',
    width: 70,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  textWrap: {
    flex: 1,
  },

  title: {
    fontFamily: 'RalewayBold',
    fontSize: 28,
  },
});
