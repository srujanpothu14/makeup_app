import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Text,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, shadows } from "../theme";

/* -------------------- TYPES -------------------- */

type Props = {
  image: ImageSourcePropType;
};

/* -------------------- COMPONENT -------------------- */

export default function MapCard({ image }: Props) {
  const openMaps = () => {
    Linking.openURL("https://maps.app.goo.gl/FCCi1bsaCp5yQNi77");
  };

  return (
    <TouchableOpacity onPress={openMaps} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={image} style={styles.image} />

        <View style={styles.overlay}>
          <Ionicons name="navigate-outline" size={20} color={colors.white} />
          <Text style={styles.text}>Get Directions</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    overflow: "hidden",
    ...shadows.card,
  },

  image: {
    height: 180,
    width: "100%",
  },

  overlay: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    bottom: 12,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: "absolute",
    right: 12,
  },

  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
